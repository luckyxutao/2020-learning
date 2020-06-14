const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { smart } = require("webpack-merge");
const base = require("./webpack.base");
const SkeletonWebpackPlugin = require('./SkeletonWebpackPlugin');
module.exports = smart(base, {
  mode: "development",
  context: process.cwd(),
  entry: {main:"./src/index.js"},
  output:{
    filename:'main.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", //指定模板文件
      filename: "index.html" //产出后的文件名
    }),
    new SkeletonWebpackPlugin({
        webpackConfig: require('./webpack.skeleton')
    })
  ]
});