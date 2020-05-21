class DonePlugin{
    constructor(options){
        this.options = options;
    }
    apply(compiler){
        compiler.hooks.done.tap('DonePlugin',()=>{
            console.log(this.options.message)
        })
    }
}

module.exports = DonePlugin;