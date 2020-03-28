
const fs = require('fs');
const SingleEntryPlugin = require('./SingleEntryPlugin')
class EntryOptionPlugin{
    apply(compiler){
        compiler.hooks.entryOption.tap('EntryOptionPlugin',(context,entry)=>{
            // context上下文， entry入口 , main
            new SingleEntryPlugin(context,entry,'main').apply(compiler);
        });
    }
}

module.exports = EntryOptionPlugin;