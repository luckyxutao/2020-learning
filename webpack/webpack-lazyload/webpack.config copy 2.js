const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const DonePlugin = require('./plugins/DonePlugin')
const OptimizePlugin = require('./plugins/OptimizePlugin')
// const AsyncPlugin = require('./plugins/AsyncPlugin')
const ZipPluginPromise = require('./plugins/ZipPluginPromise')
const PrefetchPlugin = require('./plugins/PrefetchPlugin')
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devtool: 'none',
    mode: 'development',
    devServer: {
        hot: true,
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, 'loaders')]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./src/index.html'
        }),
        // new DonePlugin({
        //     message:'编译完成'
        // }),
        new PrefetchPlugin({
            name : '111.zip'
        })
    ],
    module: {
        rules: [{
            test : /\.(jpg|png|gif)$/,
            use :[{
                loader : 'file2-loader',
                options:{
                    limit : 1024*64,
                    filename:'[name].[hash].[ext]'
                }
            }]
        },{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /hello\.js$/,
            loader: 'preloader',
            enforce: 'pre'
        }, {
            test: /hello\.js$/,
            loader: 'postloader',
            enforce: 'post'
        }, {
            test: /hello\.js$/,
            loader: 'normalloader',
        }]
    },
}