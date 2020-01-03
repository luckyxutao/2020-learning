const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    entry: './src/index.js',
    // entry:{
    //     index:'./src/index.js',// chunk index
    //     common:'./src/common.js'
    // },
    mode:'development',
    optimization:{ //放优化内容
        minimizer:[new Ter]
    },
    // devTool:'eval',
    module:{
        rules:[{
            test:/\.css$/,
            //从右向左，从loader
            use:[MiniCssExtractPlugin.loader,'css-loader']
        },{
            test:/\.(jpg|png|gif|jpeg|svg)$/,
            use:{
                loader:'url-loader',
                options:{
                    limit:10*1024
                }
            }
        }]
    },
    output:{
        // hash //有一个文件变化，每个文件都会更新成新的hash值
        //chunkhash 
        //contenthash
        publicPath:'/',
        filename:'[name].[hash:8].bundle.js',
        path : path.resolve(__dirname,'dist')
    },
    //使用了devServer，所有产出的文件都会写到内存里，主要为了速度
    devServer:{
        contentBase:path.join(__dirname,'dist')
    },
    plugins:[
        new HtmlWebpackPlugin({
          template:'./src/index.html'  ,
        //   chunks:['common','index'],//引入哪些
        //   chunksSortMode:'manual', //保证顺序
          hash:true //避免缓存，可
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename:'[name].css', //main entry名
            // chunkFilename : '[id].css' //异步加载时候用到的
        })
    ]
}