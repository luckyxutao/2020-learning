class MyPlugin{
    apply(compiler){
        compiler.hooks.environment.tap('MyPlugin',()=>{
            console.log('myPlugin environent')
        });
    }
}

module.exports = MyPlugin;