const { Tapable, SyncHook } = require('tapable');
const path = require('path');
const Parser = require('./Parser');
const parser = new Parser();
class Compilation extends Tapable {
    constructor(compiler) {
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
        this.dependencyFactories = new Map();
        this.hooks = {
            succeedEntry: new SyncHook(["entry", "name", "module"]),
            addEntry: new SyncHook(["entry", "name"]),
            //一个模块成功后
            succeedModule: new SyncHook(["module"]),
        }
    }
    addEntry(context, entry, name, callback) {
        this.hooks.addEntry.call(entry, name);
        this._addModuleChain(
            context,
            entry,
            name,
            (err, module) => {
                this.entries.push(module);
                this.hooks.succeedEntry.call(entry, name, module);
                return callback(null, module);
            })
    }
    _addModuleChain(context,dependency,name,callback){
        //1.创建模块
        const Dep = dependency.constructor;
        const moduleFactroy = this.dependencyFactories.get(Dep);
        const module = moduleFactroy.create({
            name, //main
            context, //
            rawRequest:dependency.request,
            //入口模块绝对路径
            resource:path.posix.join(context,dependency.request),
            parser
        });
        //
        callback(null,module);
        
    }
}

module.exports = Compilation;