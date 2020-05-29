const SingleEntryOptionPlugin = require('./SingleEntryOptionPlugin')
class EntryOptionPlugin {
    apply(compiler){
        compiler.hooks.entryOption.tap('entryOptionPlugn',(context,entry)=>{
            //注册了个监听make钩子的插件
            new SingleEntryOptionPlugin(context,entry,'main').apply(compiler);
        });
    }
}

module.exports = EntryOptionPlugin;