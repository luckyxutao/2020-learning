const path = require('path')
const NodeEnvironmentPlugin = require('./plugins/NodeEnvironmentPlugin')
const Compiler = require('./Compiler');
function webpack(options){
    //工作目录
    options.context = options.context || path.resolve(process.cwd());
    let compiler = new Compiler(options.context);
    compiler.options = options;
    new NodeEnvironmentPlugin().apply(compiler);
    if(options.plugins && Array.isArray(options.plugins)){
        for(let i = 0;i<options.plugins.length;i++){
            options.plugins[i].apply(compiler);
        }
    }
    compiler.hooks.environment.call();
    compiler.hooks.afterEnvironment.call();
    return compiler;
}

module.exports = webpack;