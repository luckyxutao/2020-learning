const path = require('path');
module.exports = {
    entry : './src/index.js',
    mode : 'development',
    devtool:'none',
    output:{
        path :path.resolve(__dirname,'dist'),
        filename:'bundle.js'
    },
    resolveLoader:{
        // alias:{
        //     'babel-loader':path.resolve(__dirname,'./loaders/babel-loader.js')
        // },
        modules:[path.resolve(__dirname,'./loaders'),'node_modules']
    },
    module:{
        rules:[{
            test:/\.jsx?$/,
            use :  ['loader1','loader2','loader3']
        }]
    },
    plugins:[]
}