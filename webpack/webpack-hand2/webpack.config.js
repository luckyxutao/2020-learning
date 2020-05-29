const path = require('path');
const DonePlugin = require('./DonePlugin')
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
        new DonePlugin()
    ]
}