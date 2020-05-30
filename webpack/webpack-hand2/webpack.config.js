const path = require('path');
const ObserverModulePlugin = require('./webpack/plugins/ObserverModulePlugin')
module.exports = {
    context : process.cwd(),
    mode:'development',
    devtool:'none',
    entry : './src/index.js',
    output:{
        path : path.resolve(__dirname,'dist'),
        filename:'bundle.js'
    },
    plugins:[
        // new ObserverModulePlugin()
    ]
}