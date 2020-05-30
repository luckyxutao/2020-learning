const { Tapable } = require('tapable')
class ObserverModulePlugin extends Tapable {
    // constructor(){
    //     super()
    //     console.log('初始化donePlugin')
    // }
    apply(compiler) {
        compiler.hooks.compilation.tap('ObserverModulePlugin',compilation=>{
            compilation.hooks.buildModule.tap('xxx',(module)=>{
                console.log('开始编译:' ,module.moduleId)
            })
            compilation.hooks.succeedModule.tap('xxx',(module)=>{
                console.log('成功编译:' ,module.moduleId)
            })
        })
        // compiler.hooks.environment.tap('ObserverModulePlugin',()=>{
        //     console.log('environment')
        // });
        // compiler.hooks.afterEnvironment.tap('ObserverModulePlugin',()=>{
        //     console.log('afterenvironment')
        // })
    }
}

module.exports = ObserverModulePlugin;