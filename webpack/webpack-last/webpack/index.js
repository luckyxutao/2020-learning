
const NodeEnvironmentPlugin = require('./plugins/NodeEnvironmentPlugin');
const Compiler = require('./Compiler');
const WebpackOptionsApply = require('./WebpackOptionsApply');
function webpack(options,callback){
    let compiler;
    //上下文地址非常重要，或是指向参数里的上下文 
    options.context = options.context|| process .cwd;
    compiler = new Compiler(options.context);
    compiler.options = options;
    new NodeEnvironmentPlugin().apply(compiler);
    if(options.plugins && Array.isArray(options.plugins)){
        options.plugins.forEach(fn=>fn.apply(compiler))
    }
    compiler.hooks.environment.call();
    compiler.hooks.afterEnvironment.call();
    new WebpackOptionsApply().process(options,compiler);
    return compiler;
}
module.exports = webpack;