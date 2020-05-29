
class SingleEntryOptionPlugin {
    constructor(context,entry,name){
        //项目根目录
        this.context = context;
        //入口
        this.entry = entry;
        // chunkName 默认是 main
        this.name = name;
    }
    apply(compiler){
        //callback 最终回调，所有模块完成才调的
        compiler.hooks.make.tapAsync('SingleEntryOptionPlugin',(compilation,callback)=>{
            const { context, entry , name} = this;
            // compilation.addEntry(context,entry,name,callback)
        });
    }
}

module.exports = SingleEntryOptionPlugin;