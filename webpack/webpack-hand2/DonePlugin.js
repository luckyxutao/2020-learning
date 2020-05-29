const { Tapable } = require('tapable')
class DonePluin extends Tapable {
    constructor(){
        super()
        console.log('初始化donePlugin')
    }
    apply(compiler) {
        compiler.hooks.environment.tap('DonePluin',()=>{
            console.log('environment')
        });
        compiler.hooks.afterEnvironment.tap('DonePluin',()=>{
            console.log('afterenvironment')
        })
    }
}

module.exports = DonePluin;