const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require('webpack');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devtool:'none',
    mode: 'development',
    devServer:{
        hot:true,
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: ['style-loader','css-loader',{
                loader : 'px2rem-loader',
                options : {
                    remunit:75,
                    remPrecesion:8
                }
            }]
        },{
            test : /\.js$/,
            loader: 'babel-loader'
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name]@[hash].css',
            chunkFilename:'[id].css'
        }),
        // new CleanWebpackPlugin({

        // }),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true),
            VERSION: "1",
            EXPRESSION: "1+2",
            COPYRIGHT: {
                AUTHOR: JSON.stringify("珠峰培训")
            }
        }),
        new HtmlWebpackPlugin({
            loader: "raw-loader",
            template: './src/index.html',//指定模板文件
            // filename: 'index.html',//产出后的文件名
            // inject: false,
            // hash: true,//为了避免缓存，可以在产出的资源后面添加hash值
            // chunks: ['common', 'index'],
            // chunksSortMode: 'manual'//对引入代码块进行排序的模式
        }),
        // new webpack.DllReferencePlugin({
        //     manifest:path.resolve(__dirname,'dist','lib.dll.json')
        // })
    ]
}