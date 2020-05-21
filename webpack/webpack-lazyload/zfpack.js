const path = require('path');
const fs = require('fs');
const babylon = require('babylon');
const types = require('babel-types');
const traverse = require('babel-traverse').default;
const generator = require('babel-generator').default;
const {join,dirname} = require('path').posix;
const ejs = require('ejs')
const mainTemplate = fs.readFileSync('./zfpack-template-main.ejs','utf8');
const chunkTemplate = fs.readFileSync('./zfpack-template-chunk.ejs','utf8');
/*
1. babylon转成ast
2. traverse遍历ast
3. 找到节点,types修改节点
4. generator根据修改后的ast生成新的代码


*/
class Compiler {
    constructor(config) {
        this.config = config;
    }
    run() {
        //1.找到入口
        let { entry } = this.config;
        //是入口，相对于项目根目录的路径
        this.entry = entry;
        //存放所有的目录，bootStrap的参数

        // this.modules = {};
        this.chunks = {
            main:{}
        }
        this.buildModule(entry,'main');
        this.emitFiles();

    }
    buildModule(moduleId,chunkId){
        let originalSource = fs.readFileSync(moduleId,'utf8');
        let ast = babylon.parse(originalSource,{
            plugins:['dynamicImport']
        });
        //本模块所依赖的模块ID数组
        const dependencies = [];
        traverse(ast,{
            CallExpression:(nodePath)=>{
                if(nodePath.node.callee.name === 'require'){
                    let node = nodePath.node;
                    node.callee.name = '__webpack_require__';
                    let moduleName = node.arguments[0].value;
                    let dependencyModuleId = `./` + join(dirname(moduleId),moduleName)
                    node.arguments = [types.stringLiteral(dependencyModuleId)];
                    dependencies.push(dependencyModuleId);
                } else if(types.isImport(nodePath.node.callee)){//如果是动态import
                    let node = nodePath.node;
                    let moduleName = node.arguments[0].value;
                    let dependencyModuleId = `./` + join(dirname(moduleId),moduleName);
                    let dependencyChunkId = dependencyModuleId.slice(2).replace(/[/.]/g,'_');
                    /*
                        1. 根据chunkId异步请求模块
                        2. 包裹成模块，给模块加上export.default = 代码块
                    */
                    nodePath.replaceWithSourceString(
                        `__webpack_require__.e("${dependencyChunkId}").then(__webpack_require__.t.bind(null,"${dependencyModuleId}"))`
                    );
                    //递归查找动态片断的依赖
                    this.buildModule(dependencyModuleId,dependencyChunkId);
                }
            }
        });
        let {code} = generator(ast);
        //当前模块所依赖的模拟map
        // this.modules[moduleId] = code;
        if(!this.chunks[chunkId]){
            this.chunks[chunkId] = {};
        }
        this.chunks[chunkId][moduleId] = code;
        dependencies.forEach(dependency=>this.buildModule(dependency,chunkId));
    }
    emitFiles(){
        let { output } = this.config;
        Object.keys(this.chunks).forEach(chunkId=>{
            if(chunkId === 'main'){
                let outputFile = join(output.path,output.filename);
                let bundle = ejs.compile(mainTemplate)({
                    entry : this.entry,
                    modules : this.chunks[chunkId]
                });
                fs.writeFileSync(outputFile,bundle);
            } else {
                let outputFile = join(output.path,chunkId + '.js');
                let bundle = ejs.compile(chunkTemplate)({
                    chunkId,
                    modules : this.chunks[chunkId]
                });
                fs.writeFileSync(outputFile,bundle);
            }
        });

    }
}
function webpack(webpackOptions) {
    let compiler = new Compiler(webpackOptions);
    compiler.run();
    return compiler;
}

module.exports = webpack;


// //moduleId = './src/index.js'
// let moduleId = './src/index.js';
// // './src'
// console.log('./'+join(dirname(moduleId),'hello.js'))