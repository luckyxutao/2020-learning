
class Chunk{
    constructor(module){
        this.name = module.name;
        //入口模块，文件名称
        this.entryModule = module;
        //
        this.modules = null;
        this.files = [];
    }
}

module.exports = Chunk;