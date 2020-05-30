
class Chunk{
    constructor(name){
        this.name = name;
        //入口模块，文件名称
        this.entryModule = null;
        //
        this.modules = null;
        this.files = [];
    }
}

module.exports = Chunk;