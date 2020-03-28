let fs = require('fs');
let path = require('path');
let ejs = require('ejs');
const babylon = require('babylon');
let types = require('babel-types');
let generate = require('babel-generator').default;
let traverse = require('babel-traverse').default;
class NormalModule {
    constructor({ name, context, request }) {
        this.name = name;//main
        this.context = context;///Users/xutao/work/demos/2020-learning/webpack/webpack-last/
        this.request = request; ///Users/xutao/work/demos/2020-learning/webpack/webpack-last/src/index.js
        this.dependencies = [];
        this.moduleId;
        this._ast;//抽象语法树
        this._source;

    }
    getSource(request,compilation){
        let source = compilation.inputFileSystem.readFileSync(this.request,'utf8');
        let { module: { rules } } = compilation.options;
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            if (rule.test.test(request)) {
                let loaders = rule.use;
                let loaderIndex = loaders.length - 1;
                let iterateLoaders = ()=>{
                    let loaderName = loaders[loaderIndex];
                    let loader = require(path.resolve(this.context, 'loaders', loaderName));
                    source = loader(source);
                    if (loaderIndex > 0) {
                        loaderIndex--;
                        iterateLoaders();
                    }
                }
                iterateLoaders();
                break;
            }
        }
        return source;
    }
    build(compilation) {
        // 通过request读取文件内容
        let originSource = this.getSource(this.request,compilation);
        // let originSource = compilation.inputFileSystem.readFileSync(this.request, 'utf8');
        // 通过babylon6 转为 ast 抽象语法树
        const ast = babylon.parse(originSource);
        //
        let dependencies = [];
        // 通过 babel-traverse对ast进行遍历
        traverse(ast, {
            CallExpression: (nodePath) => {
                if (nodePath.node.callee.name === 'require') {
                    let node = nodePath.node;
                    //找到依赖，把依赖转为webpack自己的require
                    node.callee.name = '__webpack_require__';
                    let moduleName = node.arguments[0].value;//'./title'
                    let extname = moduleName.split(path.posix.sep).pop().indexOf('.') === -1 ? '.js' : ''
                    //获取模块绝对路径
                    let dependencyRequest = path.posix.join(path.posix.dirname(this.request), moduleName + extname);
                    //获取依赖模块的id,把路径转换为相对于项目根目录 './src/title.js
                    let dependencyModuleId = './' + path.posix.relative(this.context, dependencyRequest);
                    dependencies.push({
                        name : this.name,
                        context : this.context,
                        request : dependencyRequest
                    });
                    // 把参数从./index改为相对于工程根目录./src/title.js
                    node.arguments = [types.stringLiteral(dependencyModuleId)];
                }
            }
        });
        let {code } = generate(ast);
        this._ast = ast; //修改后的AST
        this._source = code; //当前模块对应源码
        this.moduleId = './' + path.posix.relative(this.context, this.request);
        compilation.modules.push(this);//添加本模块
        compilation._modules[this.request] = module;
        compilation.buildDependencies(this,dependencies);
        this.dependencies = dependencies;
        return this;
    }
}

module.exports = NormalModule;