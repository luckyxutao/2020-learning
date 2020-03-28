class SingleEntryPlugin{
    constructor(context,entry,name){
        this.context = context;
        this.entry = entry;
        this.name = name;
    }
    apply(compiler){
        // compler 整个编译对象
        // compilation代表一次编译
        compiler.hooks.make.tapAsync('SingleEntryPlugin',(compilation,callback)=>{
            let {context,entry,name} = this;
            compilation.addEntry(context,entry,name,callback);
        });
    }

}

module.exports = SingleEntryPlugin;