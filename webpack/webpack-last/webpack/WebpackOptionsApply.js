
let EntryOptionPlugin = require('./plugins/EntryOptionPlugin');
class WebpackOptionsApply{
    process(options,compiler){
        compiler.hooks.afterPlugins.call(compiler);
        //挂载入口 ，监听make事件 
        new EntryOptionPlugin().apply(compiler);
        //触发compiler.hooks上的entryOption
        //触发了
        compiler.hooks.entryOption.call(options.context,options.entry);
    }
}
module.exports = WebpackOptionsApply;