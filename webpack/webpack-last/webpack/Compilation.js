
const {
    Tapable,
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    AsyncSeriesHook
} = require("tapable");
const normalModuleFactory = require('./NormalModuleFactory');
const Chunk = require('./chunk');
const path = require('path')
const ejs = require('ejs');
const fs = require('fs');
const mainTemplate = fs.readFileSync(path.posix.join(__dirname,'main.ejs'),'utf8');
let mainRender = ejs.compile(mainTemplate);

class Compilation extends Tapable {
    constructor(compiler) {
        super();
        this.compiler = compiler;
        this.options = compiler.options;
        this.context = compiler.context;
        this.inputFileSystem = compiler.inputFileSystem;
        this.outputFileSystem = compiler.outputFileSystem;
        this.hooks = {
            addEntry: new SyncHook(['entry', 'name']),
            seal: new SyncHook([]),
            beforeChunks: new SyncHook([]),
            afterChunks : new SyncHook([])
        }
        //代表入口，放着所有入口模块
        this.entries = [];
        this.modules = []; //这是一个模块的数组，里面的模块实例
        this._modules = {}; //这是一个对象 key是模块的绝对路径，值是模块实例
        this.chunks = [];
        this.files = [];
        this.assets = {};
    }
    addEntry(context, entry, name, finallyCallback) {
        this.hooks.addEntry.call(entry, name);
        this._addModuleChain(context, entry, name)
        finallyCallback();
    }
    buildDependencies(module,dependencies){
        module.dependencies = dependencies.map(data=>{
            let childModule = normalModuleFactory.create(data);
            return childModule.build(this);
        })
    }
    _addModuleChain(context, entry, name) {
        let module = normalModuleFactory.create({
            name, //所属代码块的名字 main
            context: this.context,
            request: path.posix.join(context, entry)
        });
        module.build(this);
        //把编译后的入口模块添加到入口数组
        this.entries.push(module);
        // console.log(this.entries);
        // console.log(this.modules);
    }

    seal(callback){
        this.hooks.seal.call();
        this.hooks.beforeChunks.call();
        for(let entryModule of this.entries){
            let chunk = new Chunk(entryModule);
            this.chunks.push(chunk);
            //只要模块 的名字和代码的名字一样，就说明这个模块属于这个代码
            chunk.modules = this.modules.filter(module=>module.name === chunk.name);
        }
        this.hooks.afterChunks.call();
        this.createChunkAssets();
        callback();
    }
    createChunkAssets(){
        for(let i=0;i<this.chunks.length;i++){
            const chunk = this.chunks[i];
            chunk.files = [];
            const file = chunk.name + '.js';
            let source = mainRender({
                entryId: chunk.entryModule.moduleId,
                modules:chunk.modules
            });
            chunk.files.push(file);
            this.emitAsset(file,source);
        }
    }
    emitAsset(file,source){
        this.assets[file] = source;
        this.files.push(file);
    }
}

module.exports = Compilation;