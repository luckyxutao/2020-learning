let webpack = require("webpack");
let path = require('path');
let MFS = require("memory-fs");
var requireFromString = require("require-from-string");
let mfs = new MFS();
let HTMLWebpackPlugin = require('html-webpack-plugin');
class SkeletonPlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    let { webpackConfig } = this.options;
    compiler.hooks.compilation.tap("SkeletonPlugin", compilation => {
        const hooks = HTMLWebpackPlugin.getHooks(compilation);
        hooks.beforeEmit.tapAsync('SkeletonPlugin',(data,cb)=>{
            return new Promise((resolve,reject)=>{
                let outputPath = path.join(webpackConfig.output.path,webpackConfig.output.filename);
                let childCompiler = webpack(webpackConfig);
                childCompiler.outputFileSystem = mfs;
                childCompiler.run((err, stats) => {
                    let skeleton= mfs.readFileSync(outputPath, "utf8");
                    let skeletonHtml = requireFromString(skeleton);
                    if (skeletonHtml.default) {
                    skeletonHtml = skeletonHtml.default;
                    }
                    data.html=data.html.replace(`<div id="root"></div>`,`<div id="root">${skeletonHtml}</div>`);
                    cb(null, data);
                });
            });
        });
        
    //   compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
    //     "SkeletonPlugin",
    //     (htmlPluginData, callback) => {
    //       let outputPath = path.join(webpackConfig.output.path,webpackConfig.output.filename);
    //       let childCompiler = webpack(webpackConfig);
    //       childCompiler.outputFileSystem = mfs;
    //       childCompiler.run((err, stats) => {
    //         let skeleton= mfs.readFileSync(outputPath, "utf8");
    //         let skeletonHtml = requireFromString(skeleton);
    //         if (skeletonHtml.default) {
    //           skeletonHtml = skeletonHtml.default;
    //         }
    //         htmlPluginData.html=htmlPluginData.html.replace(`<div id="root"></div>`,`<div id="root">${skeletonHtml}</div>`);
    //         callback(null, htmlPluginData);
    //       });
    //     }
    //   );
    });
  }
}
module.exports = SkeletonPlugin;