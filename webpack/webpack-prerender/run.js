const webpackconfig = require('./webpack.config');
const webpack = require('webpack')
const compiler = webpack(webpackconfig);
compiler.run();