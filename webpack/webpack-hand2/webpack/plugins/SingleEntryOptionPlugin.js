const SingleEntryDependency = require('../dependiencies/SingleEntryDependency')
class SingleEntryOptionPlugin {
    constructor(context, entry, name) {
        //项目根目录
        this.context = context;
        //入口
        this.entry = entry;
        // chunkName 默认是 main
        this.name = name;
    }
    apply(compiler) {
        compiler.hooks.compilation.tap('SingleEntryPlugin', (compilation, { normalModuleFactory }) => {
            compilation.dependencyFactories.set(SingleEntryDependency, normalModuleFactory);
        });
        //callback 最终回调，所有模块完成才调的
        compiler.hooks.make.tapAsync('SingleEntryOptionPlugin', (compilation, callback) => {
            const { context, entry, name } = this;
            const dep = SingleEntryOptionPlugin.createDependency(entry, name);
            compilation.addEntry(context, dep, name, callback)
        });
    }
    static createDependency(entry, name) {
        const dep = new SingleEntryDependency(entry);
        return dep;
    }
}

module.exports = SingleEntryOptionPlugin;