const { Tapable, AsyncSeriesHook, SyncHook, SyncBailHook, AsyncParallelHook } = require('tapable');
const Compilation = require('./Compilation');
const Stats = require('./Stats');
const NormalModuleFactory = require('./NormalModuleFactory');
class Compiler extends Tapable {
    constructor(context) {
        super(context);
        this.options = {};
        this.context = context;
        this.hooks = {
            //处理入口
            entryOption: new SyncBailHook(["context", "entry"]),
            //开始编译事件
            make: new AsyncParallelHook(["compilation"]),
            //环境信息
            environment: new SyncHook([]),
            afterEnvironment: new SyncHook([]),
            //运行
            beforeRun: new AsyncSeriesHook(["compiler"]),
            run: new AsyncSeriesHook(["compiler"]),
            // 编译前后
            beforeCompile: new AsyncSeriesHook(["params"]),
            compile: new SyncHook(["params"]),

            //创建一个新的compilation
            thisCompilation: new SyncHook(["compilation", "params"]),
            //创建compilation成功
            compilation: new SyncHook(["compilation", "params"]),
            //完成编译
            done: new AsyncSeriesHook(["stats"]),
        }
    }
    //编译完后的回调,外边的
    run(finalCallback) {
        const onCompiled = (err, compilation) => {
            const stats = new Stats(compilation);
            finalCallback(err, stats)
        }
        this.hooks.beforeRun.callAsync(this, err => {
            this.hooks.run.callAsync(this, err => {
                this.compile(onCompiled);
            });
        });
    }
    newCompilationParams() {
        const params = {
            normalModuleFactory: new NormalModuleFactory(),
            // contextModuleFactory: this.createContextModuleFactory(),
            // compilationDependencies: new Set()
        };
        return params;
    }
    //编译
    compile(onCompiled) {
        const params = this.newCompilationParams();
        this.hooks.beforeCompile.callAsync(params, err => {

            this.hooks.compile.call(params);
            //创建并广播出去
            const compilation = this.newCompilation(params);
            //触发make-entryOption
            this.hooks.make.callAsync(compilation, err => {
                console.log('编译完成');
                onCompiled(null,compilation);
            });
        });
    }
    newCompilation(params){
        const compilation = new Compilation(this);
        this.hooks.thisCompilation.call(compilation, params);
        //将compilation发广播出去
		this.hooks.compilation.call(compilation, params);
		return compilation;
    }
}

module.exports = Compiler;