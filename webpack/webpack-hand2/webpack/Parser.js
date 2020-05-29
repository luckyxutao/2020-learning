
const { Tapable} = require('tapable');
const babylon = require('babylon');
class Parser extends Tapable{
    parse(source){
        return babylon.parse(source,{
            sourceType:'module',
            plugins:["dynamicImport"]
        })
    }
}

module.exports = Parser;