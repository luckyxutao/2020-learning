const path = require('path');
const nodeExternal = require('webpack-node-externals');
module.exports = {
    target: 'node',
    mode: 'development',
    entry: './src/server/index.js',
    output: {
        path: path.resolve('build'),
        filename: 'server.js'
    },
    //负责检查所有引入的模块，并且告诉webpack不要所核心模块打包到server.js里
    externals: [nodeExternal()],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react'
                    ],
                    plugins: [
                        '@babel/plugin-transform-runtime',
                        '@babel/plugin-proposal-class-properties'
                    ]
                }
            }
        ]
    }
}