const babel = require('@babel/core');
const path = require('path');
const loaderUtils = require('loader-utils');
function loader(inputSource) {
    const options = {
        presets: ['@babel/preset-env'],
        sourceMaps: true
    };
    console.log(loaderUtils.getOptions(this));
    // console.log(this.resourcePath,path.basename(this.resourcePath));
    
    let { code, map, ast } = babel.transform(inputSource, options);
    //把source map code都传给webpack ,webpack自己就不生成as
    return this.callback(null, code, map, ast);
}

module.exports = loader;