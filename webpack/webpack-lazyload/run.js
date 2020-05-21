const webpack = require('./zfpack');
// const webpack = require('webpack');
const config = require('./webpack.config');
let compiler = webpack(config);
compiler.run((err,stat)=>{
    // console.log(stat)
})