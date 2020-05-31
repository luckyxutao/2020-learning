/**
 * 读取文件的内容，重命名并写入到新的输出目录
 * @param {*} inputSource 
 */
const {getOptions, interpolateName} = require('loader-utils')
function loader(content){
    //loaderUtils
    let options = getOptions(this) || {};
    let filename = options.filename || '[name].[hash].[ext]'
    let outputFilename = interpolateName(this,filename,{content})
    this.emitFile(outputFilename,content);
    return `module.exports=${JSON.stringify(outputFilename)}`
}
loader.raw = true;
module.exports = loader;