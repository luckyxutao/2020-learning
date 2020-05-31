// const { Tapable, SyncHook } = require('tapable');
const path = require('path');
const types = require('babel-types');
const generate = require('babel-generator').default;
const traverse = require('babel-traverse').default;
const async = require('neo-async');
const runLoaders = require('./loader-runner');
const fs = require('fs')
const SingleEntryDependency = require('./dependiencies/SingleEntryDependency');
class NormalModule {
    /*
    name : 入口名字
    context 项目根目录
    rawRequest:原始路径 ./title.js
    resource: 绝对路径
    parser:解析器ast
    */
    constructor({ moduleId, name, context, rawRequest, resource, parser,async }) {
        this.moduleId = moduleId;
        this.name = name;
        this.context = context;
        this.rawRequest = rawRequest;
        this.resource = resource;
        this.parser = parser;
        //处理async
        this.blocks = [];
        this.async = async;
        //此模块的依赖
        this.dependencies = [];
        //转换后源码
        this._source = null;
        this._ast = null;
    }
    /*
        1. 根据路径读source
        2. runloaders,找到所有loader(行内,post,pre,auto),进行转换得到js
        3. js转ast
        4. 遍历ast，找到依赖模块(require,import,import())并添加到当前dependencies中
    */
    build(compilation, callback) {
        //读取源文件，loader转换
        this.doBuild(compilation, err => {
            //转成语法树，分析依赖
            this._ast = this.parser.parse(this._source);
            traverse(this._ast, {
                CallExpression: (nodePath) => {
                    let node = nodePath.node;
                    if (node.callee.name == 'require') {
                        //1. 更换成webpack自己的,路径也要换
                        // webpack_require('./src/title.js)
                        node.callee.name = '__webpack_require__';
                        //2.拿到模块id ./src/title
                        let modulName = node.arguments[0].value;
                        //3. 拿扩展名
                        //[".", "title"]
                        let extension = modulName.split(path.posix.sep).pop().indexOf('.') == -1 ? '.js' : '';
                        //获取依赖模块绝对路径
                        let dependencyResourceAbsPath;
                        if(modulName.startsWith('.')){
                            dependencyResourceAbsPath = path.posix.join(
                                path.posix.dirname(this.resource),
                                modulName + extension
                            );
                        } else {//第三方模块
                            dependencyResourceAbsPath = require.resolve(path.posix.join(this.context, 'node_modules', modulName));
                            dependencyResourceAbsPath = dependencyResourceAbsPath.replace(/\\/g, path.posix.sep);
                        }
                        //./src/title.js
                        let dependencyModuleId = '.' + path.posix.sep + path.relative(this.context,dependencyResourceAbsPath);
                        this.dependencies.push({
                            name : this.name, //main默认依赖的模块名称和
                            context : this.context,
                            // rawRequest : modulName,原始路径
                            //依赖模块的绝对路径
                            resource : dependencyResourceAbsPath,
                            moduleId:dependencyModuleId
                        });
                        node.arguments = [types.stringLiteral(dependencyModuleId)];
                    } else if (types.isImport(nodePath.node.callee)) {//处理了import()
                        //获取要加载的模块ID
                        let moduleName = node.arguments[0].value;
                        //获取扩展名
                        let extension = moduleName.split(path.posix.sep).pop().indexOf('.') == -1 ? '.js' : '';
                        //获取依赖模块的绝对路径
                        let dependencyResource = path.posix.join(path.posix.dirname(this.resource), moduleName + extension);
                        //获取依赖模块的模块ID
                        let dependencyModuleId = '.' + path.posix.sep + path.posix.relative(this.context, dependencyResource);
                        //获取代码块的ID
                        debugger
                        let dependencyChunkId = dependencyModuleId.slice(2, dependencyModuleId.lastIndexOf('.')).replace(path.posix.sep, '_', 'g');
                        // chunkId 不需要带 .js 后缀
                        nodePath.replaceWithSourceString(`
                            __webpack_require__.e("${dependencyChunkId}").then(__webpack_require__.t.bind(null,"${dependencyModuleId}",7))
                        `);
                        this.blocks.push({
                            context: this.context,
                            entry: dependencyModuleId,
                            name: dependencyChunkId,
                            async: true
                        });
                    }
                }
            });
            const {code} = generate(this._ast);
            this._source = code;
            //处理异步依赖模块，递归处理过错了，再处理其同级模块
            async.forEach(this.blocks, ({ context, entry, name, async }, done) => {
                let newEntry = new SingleEntryDependency(entry,name);
                compilation._addModuleChain(context,newEntry, name, async, done);
            }, callback);
            // callback();
        });
    }
    doBuild(compilation, afterDoBuild) {
        //绝对路径this.resource
        this.getSource(this.resource, compilation, (err, originSource) => {
            this._source = originSource;
            afterDoBuild();
        });
    }
    //resource资源路径
    getSource(resource, compilation, afterGetSource) {
        let { module: { rules } } = compilation.options;
        let loaders = [];
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            if (rule.test.test(resource)) {
                let useLoaders = rule.use;
                loaders = [...loaders, ...useLoaders];
            }
        }
        loaders = loaders.map(loader => require.resolve(path.posix.join(this.context, 'loaders', loader)));
        //这里少了步骤，post inline normal pre
        let source = runLoaders({
            resource,
            loaders,
            context: {},
            readResource: fs
        }, function (err, result) {
            afterGetSource(err, result);
        });
        // return source;
        // const { inputFileSystem } = compilation;
        // inputFileSystem.readFile(resourcePath, 'utf8', (err, data) => {
        //     //应该走loader-runnder转换
        //     afterGetSource(err, data);
        // });
    }
}

module.exports = NormalModule;