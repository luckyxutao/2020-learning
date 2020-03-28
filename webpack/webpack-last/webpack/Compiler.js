const { Tapable, SyncHook, AsyncParallelHook, AsyncSeriesHook } = require('tapable');
const Compilation = require('./Compilation');
const Stats = require('./Stats');
const mkdirp = require('mkdirp');
const path = require('path');
class Compiler extends Tapable {
    constructor(context) {
        super();
        this.hooks = {
            environment: new SyncHook([]),
            afterEnvironment: new SyncHook([]),
            afterPlugins: new SyncHook([]),
            entryOption: new SyncHook(['context', 'entry']),
            make: new AsyncParallelHook(['compilation']),//异步并行
            beforeRun: new AsyncSeriesHook(['compiler']),
            run: new AsyncSeriesHook(['compiler']),
            beforeCompile: new AsyncSeriesHook(["params"]),
            afterCompile: new AsyncSeriesHook(["params"]),
            compile: new SyncHook(["params"]),
            thisCompilation: new SyncHook(["compilation", "params"]),//
            compilation: new SyncHook(["compilation", "params"]),
            done: new AsyncSeriesHook(["stats"]),
            emit: new AsyncSeriesHook(['compilation'])
        }
        this.options = {}
        this.context = context;
    }
    newCompilation(params) {
        let compilation = new Compilation(this);
        this.hooks.thisCompilation.call(compilation, params);
        this.hooks.compilation.call(compilation, params);
        return compilation;
    }
    compile(onCompiled) {
        this.hooks.beforeCompile.callAsync({}, err => {
            this.hooks.compile.call();
            //创建一个新的compilation,放着本地编译的结果
            const compilation = this.newCompilation();
            //触发singleEntry监听->compilation.addEntry(context,entry,name,callback);
            this.hooks.make.callAsync(compilation, err => {
                compilation.seal(err => {//通过模块生成文件
                    this.hooks.afterCompile.callAsync(compilation, err => {
                        return onCompiled(compilation);//写入文件系统
                    });
                });
            })
        });
    }
    emitAssets(compilation, calllback) {
        const emitFiles = err => {
            //一个对象，对象上有属性的值{文件名称：源码}
            let assets = compilation.assets;
            for (let file in assets) {
                let source = assets[file];
                let targetPath = path.posix.join(this.options.output.path, file);
                this.outputFileSystem.writeFileSync(targetPath, source);
            }
            calllback();
        }
        this.hooks.emit.callAsync(compilation, err => {
            mkdirp(this.options.output.path, emitFiles)
        });
    }
    run(finallyCallback) {
        const onCompiled = (compilation,err) => {
            //编译完成后的回调
            console.log('doen回');
            this.emitAssets(compilation, (err) => {
                const stats = new Stats(compilation);
                this.hooks.done.callAsync(stats, err => {
                    return finallyCallback();
                });
            });
        }
        this.hooks.beforeRun.callAsync(this, err => {
            this.hooks.run.callAsync(this, err => {
                this.compile(onCompiled);
            })
        });
    }
}

module.exports = Compiler;