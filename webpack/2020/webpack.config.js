const path = require('path');
const MiniCsExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin =  require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const glob = require('glob');
// let paths = glob.sync("./src/**/*",{nodir:true});
const PurgeCssWebpackPlugin = require('purgecss-webpack-plugin');
// console.log(paths)
const DLLReferencePlugin = require('webpack').DllReferencePlugin;
const SpeedMeasureWebpackPluin = require('speed-measure-webpack-plugin');
const smw = new SpeedMeasureWebpackPluin;
module.exports = (env)=>{
    return smw.wrap({
        mode:env,
        // entry : './src/index.js',
        entry:{
            "a" : './src/export.a.js',
            "b" : './src/export.b.js'
        },
        output:{
            filename : '[name].bundle.js',
            path : path.resolve(__dirname,'dist'),
            chunkFilename:'[name].min.js'
        },
        // externals:{
        //     'jQuery':'$'
        // },
        // 生产环境下第三方模块进行抽离
        optimization:{
            // usedExports:true,
            splitChunks: {
                chunks: 'initial',
                minSize: 30000,
                maxSize: 0,
                minChunks: 1,
                maxAsyncRequests: 6,
                maxInitialRequests: 4,
                automaticNameDelimiter: '~',
                automaticNameMaxLength: 30,
                cacheGroups: {
                  react:{
                    test : /[\\/]node_modules[\\/](react)|(react-dom)/,
                    priority:-2
                  },
                  defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                  },
                  default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                  }
                }
              }
        },
        module:{
            rules:[{
                test:/\.js/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:[
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ]
                    }
                }
            },{
                test:/\.(jpe?g|png|gif)/,
                use : [{
                    loader: 'file-loader',
                },{
                    loader:'image-webpack-loader',
                    options: {
                        mozjpeg: {
                          progressive: true,
                          quality: 65
                        },
                        // optipng.enabled: false will disable optipng
                        optipng: {
                          enabled: false,
                        },
                        pngquant: {
                          quality: [0.65, 0.90],
                          speed: 4
                        },
                        gifsicle: {
                          interlaced: false,
                        },
                        // the webp option will enable WEBP
                        webp: {
                          quality: 75
                        }
                      }
                }]
            },{
                test:/\.css$/,
                use:[
                    env!=='development' ? MiniCsExtractPlugin.loader : 'style-loader','css-loader'
                ]
            }]
        },
        plugins:[
            env!=='development' && new MiniCsExtractPlugin(),
            new HtmlWebpackPlugin({
                template:'./src/index.html',
                chunks:['a'],
                filename:'index.html'
            }),
            new HtmlWebpackPlugin({
                template:'./src/index.html',
                chunks:['b','a'],
                chunksSortMode:'manual',
                filename:'login.html'
            }),
            new PurgeCssWebpackPlugin({
                paths: glob.sync('./src/**/*',{nodir:true})
            }),
            // // dll去找manifest.json文件
            // new DLLReferencePlugin({
            //     manifest : path.resolve(__dirname,'./dll/manifest.json')
            // }),
            // //将dllreact.js引入到html
            // new AddAssetHtmlPlugin({
            //     filepath : path.resolve(__dirname,'./dll/react.dll.js')
            // }),
            env!=='development' && new BundleAnalyzerPlugin()
        ].filter(Boolean)
    });
}