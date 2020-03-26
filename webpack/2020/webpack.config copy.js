const path = require('path');
const MiniCsExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin =  require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const glob = require('glob');
// let paths = glob.sync("./src/**/*",{nodir:true});
const PurgeCssWebpackPlugin = require('purgecss-webpack-plugin');
// console.log(paths)
const DLLReferencePlugin = require('webpack').DllReferencePlugin;
module.exports = (env)=>{
    return {
        mode:env,
        entry : './src/index.js',
        output:{
            filename : 'bundle.js',
            path : path.resolve(__dirname,'dist'),
            chunkFilename:'[name].min.js'
        },
        externals:{
            'jQuery':'$'
        },
        optimization:{
            usedExports:true
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
                filename:'index.html'
            }),
            new PurgeCssWebpackPlugin({
                paths: glob.sync('./src/**/*',{nodir:true})
            }),
            // dll去找manifest.json文件
            new DLLReferencePlugin({
                manifest : path.resolve(__dirname,'./dll/manifest.json')
            }),
            //将dllreact.js引入到html
            new AddAssetHtmlPlugin({
                filepath : path.resolve(__dirname,'./dll/react.dll.js')
            })
        ].filter(Boolean)
    };
}