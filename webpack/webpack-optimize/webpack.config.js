const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = {
    // entry: './src/index.js',
    entry:{
        index:'./src/index.js',// chunk index
        vendor:['react','react-dom'] //每个entry都会打一个
        // common:'./src/common.js'
    },
    mode:'production', //production才会调用optimization
    mode:'development',
    optimization:{
        minimizer:[
            new TerserPlugin({
                parallel:true,
                cache:true
            }),
            new OptimizeCSSAssetsPlugin()
        ]
    },
    // devTool:'eval',
    module:{
        rules:[{
            test:/\.html?$/i,
            use : 'html-withimg-loader'
        },{
            test:/\.css$/,
            //从右向左，从loader
            use:[MiniCssExtractPlugin.loader,'css-loader']
        },{
            test:/\.(jpg|png|gif|jpeg|svg)$/,
            use:{
                loader:'url-loader',
                options:{
                    limit:10*1024,
                    outputPath:"images",
                    publicPath:'/images'
                }
            }
        }]
    },
    output:{
        // hash //有一个文件变化，每个文件都会更新成新的hash值
        //chunkhash 
        //contenthash
        publicPath:'/',
        filename:'[name].[contenthash].js', //chunkhash和contenthash不能在这用, 这能用hash
        path : path.resolve(__dirname,'dist')
    },
    //使用了devServer，所有产出的文件都会写到内存里，主要为了速度
    devServer:{
        contentBase:path.join(__dirname,'dist')
    },
    plugins:[
        new HtmlWebpackPlugin({
          template:'./src/index.html'  ,
          chunks:['vendor','index'],//引入哪些
          chunksSortMode:'manual', //保证顺序
          hash:true //避免缓存，可
        }),
        // new CleanWebpackPlugin({
        //     cleanOnceBeforeBuildPatterns:['**/*']
        // }),
        new MiniCssExtractPlugin({
            filename:'[name].[contenthash].css', //main entry名
            // filename:'[name].[hash].[chunkhash].[contenthash].css', //main entry名
            // chunkFilename : '[id].css' //异步加载时候用到的
        })
    ]
}