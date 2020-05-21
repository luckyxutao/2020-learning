class DonePlugin{
    constructor(options){
        this.options = options;
    }
    apply(compiler){
        compiler.hooks.compilation.tap('optimizeplugin',compilation=>{
            compilation.hooks.optimize.tap('optimize-',()=>{
                console.log('webpak正在优化中')
            })
        });
    }
}

module.exports = DonePlugin;