const { Tapable, SyncHook } = require('tapable');
const path = require('path');
const Parser = require('./Parser');
const parser = new Parser();
const async = require('neo-async');
const Chunk = require('./Chunk');

const ejs = require('ejs');
const fs = require('fs');
const mainTemplate = fs.readFileSync(path.join(__dirname,'templates', 'main.ejs'), 'utf8');
const mainRender = ejs.compile(mainTemplate);
const chunkTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'chunk.ejs'), 'utf8');
const chunkRender = ejs.compile(chunkTemplate);
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
        //本次编译后产出的所有模块
        this.modules = [];
        //模块id ./src/index.js
        //key是模块id,value= 模块的代码
        this._modules = {};
        // this.assets = [];
        this.files = [];  //生成的文件
        this.assets = {}; //资源 
        this.dependencyFactories = new Map();
        this.hooks = {
            buildModule: new SyncHook(["module"]),
            succeedEntry: new SyncHook(["entry", "name", "module"]),
            addEntry: new SyncHook(["entry", "name"]),
            //一个模块成功后
            succeedModule: new SyncHook(["module"]),

            seal: new SyncHook([]),
			/** @type {SyncHook} */
			beforeChunks: new SyncHook([]),
			/** @type {SyncHook<Chunk[]>} */
            afterChunks: new SyncHook(["chunks"]),
        }
    }
    //默认async是false
    addEntry(context, entry, name, async, callback) {
        this.hooks.addEntry.call(entry, name);
        this._addModuleChain(
            context,
            entry,
            name,
            async,
            (err, module) => {
                this.hooks.succeedEntry.call(entry, name, module);
                return callback(null, module);
            })
    }
    _addModuleChain(context, dependency, name, async, callback) {
        //1.创建模块
        const Dep = dependency.constructor;
        const moduleFactroy = this.dependencyFactories.get(Dep);
        const module = moduleFactroy.create({
            name, //main
            context, //
            async,
            rawRequest: dependency.request,
            //入口模块绝对路径,统一为 unix(/)
            resource: path.posix.join(context, dependency.request),
            parser
        });
        //path.posix.sep 永远指向 /
        module.moduleId = '.' + path.posix.sep + path.posix.relative(this.context, module.resource);
        this.modules.push(module);
        this.entries.push(module);//把编译好的模块添加到入口列表里面
        const afterBuild = (err) => {
            if (module.dependencies && module.dependencies.length > 0) {
                this.processModuleDependencies(module, (err) => {
                    this.hooks.succeedModule.call(module);
                    callback(err, module);
                });
            } else {
                this.hooks.succeedModule.call(module);
                callback(err, module);
            }
        };
        this.buildModule(module, afterBuild);
        //
        // callback(null, module);

    }
    processModuleDependencies(module, afterProcessModuleDependencies) {
        //处理依赖
        let dependencies = module.dependencies;
        //1要处理的依赖，2 处理依赖的函数，每处理完一个依赖，会调一次done
        //都完成了才会调第3个参数
        async.forEach(dependencies, (dependency, done) => {
            let { name, context, rawRequest, resource, moduleId,async } = dependency;
            const moduleFactroy = this.dependencyFactories.get(dependency.constructor);
            const module = moduleFactroy.create({
                name, context, rawRequest, moduleId, resource, parser,async
            });
            this.modules.push(module);
            this._modules[moduleId] = module;
            const afterBuild = () => {
                if (module.dependencies && module.dependencies.length > 0) {
                    this.processModuleDependencies(module, err => {
                        this.hooks.succeedModule.call(module);
                        done(null, module);
                    });
                } else {
                    this.hooks.succeedModule.call(module);
                    done(null, module);
                }
            };
            this.buildModule(module, afterBuild);
        }, afterProcessModuleDependencies);
    }
    buildModule(module, afterBuild) {
        this.hooks.buildModule.call(module);
        module.build(this, err => {
            return afterBuild(err);
        });
    }

    seal(afterSealCallback){
        this.hooks.seal.call();
        this.hooks.beforeChunks.call();
        for(const module of this.entries){
            const chunk  = this.addChunk(module);
            chunk.modules = this.modules.filter(module=>module.name === chunk.name);
        }
        this.hooks.afterChunks.call(this.chunks);
        //开始seal
        this.createChunkAssets();
        afterSealCallback();//封装结束
    }
    createChunkAssets(){
        for (let i = 0; i < this.chunks.length; i++) {
            const chunk = this.chunks[i];
            chunk.files = [];
            const file = chunk.name + '.js';
            let source;
            if (chunk.async) {
                source = chunkRender({ chunkName: chunk.name, modules: chunk.modules });
            } else {
                source = mainRender({ entryId: chunk.entryModule.moduleId, modules: chunk.modules });
            }
            // const source = mainRender({ entryId: chunk.entryModule.moduleId, modules: chunk.modules });
            chunk.files.push(file);
            //生成一个chunk的信息 就发射
            this.emitAsset(file, source);
        }
    }
    emitAsset(file, source) {
        this.assets[file] = source;
        this.files.push(file);
    }
    addChunk(name){
        const chunk = new Chunk(name);
        this.chunks.push(chunk);
        return chunk;
    }
}

module.exports = Compilation;