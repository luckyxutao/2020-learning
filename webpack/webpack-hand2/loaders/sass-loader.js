
function loader(content){
    //loaderUtils
    let options = getOptions(this) || {};
    let filename = options.filename || '[name].[hash].[ext]'
    let outputFilename = interpolateName(this,filename,{content})
    this.emitFile(outputFilename,content);
    return `module.exports=${JSON.stringify(outputFilename)}`
}

module.exports = loader;