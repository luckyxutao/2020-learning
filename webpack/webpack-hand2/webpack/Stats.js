class Stats{
    constructor(compilation){
        this.modules = compilation.modules;
        this.chunks = compilation.chunks;
        this.entries = compilation.entries;
    }
    toJson(){
        return this;
    }
}
module.exports = Stats;