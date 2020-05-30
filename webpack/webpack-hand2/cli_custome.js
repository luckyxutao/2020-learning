const webpack = require('./webpack');
const options = require('./webpack.config');
const compiler = webpack(options);
compiler.run((err,stats)=>{
    console.log('run结束')
    console.log(stats.toJson())
})