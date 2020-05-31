/**
 * 读取文件的内容，重命名并写入到新的输出目录
 * 如果文件大于小于limit的话不拷贝目录，直接返回base64
 * @param {*} inputSource 
 */
const {getOptions, interpolateName} = require('loader-utils');
const mime = require('mime');
const fileLoader = require('file-loader')
function loader(content){
    //loaderUtils
    let options = getOptions(this) || {};
    let filename = options.filename || '[name].[hash].[ext]';
    let limit = options.limit || 1024*64;
    if(content.length < limit){
        const contentType = mime.getType(this.resourcePath);
        let base64 = `data:${contentType};base64,${content.toString('base64')}`;
        return `module.exports='${base64}'`
    }
    return fileLoader.call(this,content);
}
loader.raw = true;
module.exports = loader;