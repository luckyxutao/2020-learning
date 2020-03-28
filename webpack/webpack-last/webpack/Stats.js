class Stats{
    constructor(compilation){
        this.files = compilation.files;
        this.modules = compilation.modules;
    }
}

module.exports = Stats;