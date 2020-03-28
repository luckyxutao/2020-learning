class Chunk{
    constructor(module){
        this.entryModule = module;
        this.name = module.name;
        this.files = [];
    }
}

module.exports = Chunk;