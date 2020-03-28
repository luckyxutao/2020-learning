
const fs = require('fs');
class NodeEnvironmentPlugin{
    apply(compiler){
        //读写用哪个模块
        compiler.inputFileSystem = fs;
        compiler.outputFileSystem = fs;
    }
}

module.exports = NodeEnvironmentPlugin;