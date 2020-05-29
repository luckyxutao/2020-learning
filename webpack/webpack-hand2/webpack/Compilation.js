const { Tapable, SyncHook} = require('tapable');
const NormalModuleFactory = require('./NormalModuleFactory')
class Compilation extends Tapable{
    constructor(compiler){
        super();
        this.compiler = compiler;
        this.options = compiler.options;
        this.context = compiler.options.context;
        this.inputFileSystem = compiler.inputFileSystem;
        this.outputFileSystem = compiler.outputFileSystem;
        this.entries = [];
        this.chunks = [];
        this.modules = [];
        this.assets = [];
        
        this.hooks = {
            //一个模块成功后
            succeedModule: new SyncHook(["module"]),
        }
    }
    addEntry(context,entry,name,callback){
        callback(null);
    }
}

module.exports = Compilation;