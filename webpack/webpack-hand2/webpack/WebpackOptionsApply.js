
const EntryOptionPlugin = require('./plugins/EntryOptionPlugin')
class WebpackOptionsApply{
    process(options,compiler){
        new EntryOptionPlugin().apply(compiler);
        compiler.hooks.entryOption.call(options.context, options.entry);
        return options;
    }
}

module.exports = WebpackOptionsApply;