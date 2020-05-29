const { Tapable } = require('tapable')
class DonePluin extends Tapable {
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