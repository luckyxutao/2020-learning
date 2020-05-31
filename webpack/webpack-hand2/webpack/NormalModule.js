// const { Tapable, SyncHook } = require('tapable');
const path = require('path');
const types = require('babel-types');
const generate = require('babel-generator').default;
const traverse = require('babel-traverse').default;
const async = require('neo-async');
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
                        let dependencyResourceAbsPath = path.posix.join(
                            path.posix.dirname(this.resource),
                            modulName + extension
                        );
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
    getSource(resourcePath, compilation, afterGetSource) {
        const { inputFileSystem } = compilation;
        inputFileSystem.readFile(resourcePath, 'utf8', (err, data) => {
            //应该走loader-runnder转换
            afterGetSource(err, data);
        });
    }
}

module.exports = NormalModule;