const path = require('path');
const nodeExternal = require('webpack-node-externals');
const base = require('./webpack.base');
module.exports = Object.assign({},base,{
    target: 'node',
    entry: './src/server/index.js',
    output: {
        path: path.resolve('build'),
        filename: 'server.js'
    },
    externals: [nodeExternal()]
});