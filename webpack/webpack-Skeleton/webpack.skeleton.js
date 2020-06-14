const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { smart } = require("webpack-merge");
const base = require("./webpack.base");
const nodeExternals = require('webpack-node-externals');
module.exports = smart(base, {
  target: 'node',
  mode: "development",
  context: process.cwd(),
  entry: "./src/skeleton.js",
  output:{
    filename:'skeleton.js',
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals()
});