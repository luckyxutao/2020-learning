const path = require('path');
const DllPlugin = require('webpack').DllPlugin;
// 需要产生一个缓存列表
module.exports = {
    mode: 'development',
    entry : ['react','react-dom'], // add minus
    output:{
        library:'react',//放全局变量
        // libraryTarget:'commonjs2', //默认是var,commonjs, commonjs2, umd this
        filename : 'react.dll.js',
        path: path.resolve(__dirname,'dll')
    },
    plugins:[
        new DllPlugin({
            name : 'react',
            path : path.resolve(__dirname,'dll/manifest.json')
        })
    ]
    // ,
    // output:{
    //     library:'calc',//放全局变量
    //     libraryTarget:'commonjs2', //默认是var,commonjs, commonjs2, umd this
    //     filename : 'calc.js',
    //     path: path.resolve(__dirname,'dll')
    // }
}

// 目前是为了将calc打包成node