const path = require('path');
const base = require('./webpack.base');
module.exports = Object.assign({}, base, {
    entry: './src/client/index.js',
    output: {
        path: path.resolve('static'),
        filename: 'client.js'
    }
});