const path = require('path');
const MyPlugins = require('./plugins/MyPlugins')
module.exports = {
    context: process.cwd(),
    entry: './src/index.js',
    mode: 'development',
    devtool: 'none',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test : /\.css$/,
            
        }]
    },
    plugins: [
        new MyPlugins
    ]
}