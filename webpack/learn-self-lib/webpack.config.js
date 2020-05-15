const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    mode:'none',
    entry:{
        'zhufengmath':'./src/index.js',
        'zhufengmath.min':'./src/index.js'
    },
    optimization:{
        minimize:true,
        minimizer:[
            //可以支持es6,默认的使用TerserPlugin
            new TerserPlugin({
                include:/\.min\.js/
            })
        ]
    },
    output:{
        filename:'[name].js',
        library:'zhufengmath',//配置导出库的名称
        libraryExport:'var',
        libraryExport:'default',
        // libraryTarget:'umd'//配置以何种方式导出库,是字符串的枚举类型
        /*
            console.log(zhufengmath.add(25,30))
        */
        // libraryTarget:'var'//配置以何种方式导出库,是字符串的枚举类型
        libraryTarget:'umd'//配置以何种方式导出库,是字符串的枚举类型
    }
};