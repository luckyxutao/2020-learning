const path = require('path');
const nodeExternal = require('webpack-node-externals');
const base = require('./webpack.base');
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(base,{
    target: 'node',
    entry: './src/server/index.js',
    output: {
        path: path.resolve('build'),
        filename: 'server.js'
    },
    externals: [nodeExternal()],
    module:{
        rules:[
            {
                test : /\.s?css$/,
                loader : 'ignore-loader'
            }
        ]
    }
});