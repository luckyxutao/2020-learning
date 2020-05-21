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
}