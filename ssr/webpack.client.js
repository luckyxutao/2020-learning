const path = require('path');
const base = require('./webpack.base');
const webpackMerge = require('webpack-merge');
module.exports = webpackMerge(base, {
    entry: './src/client/index.js',
    output: {
        path: path.resolve('static'),
        filename: 'client.js'
    },
    module:{
        rules:[
            {
                test : /\.scss$/i,
                use : ['style-loader','css-loader','sass-loader']
            }
        ]
    }
});