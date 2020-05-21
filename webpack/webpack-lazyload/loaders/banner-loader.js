const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils')
const fs = require('fs')
function loader(inputSource,inputSourceMap) {
    let options = loaderUtils.getOptions(this);
    console.log(options)
    let schmea = {
        type: 'object',
        properties: {
            filename: {
                type: 'string',
            },
            text: {
                type: 'string'
            }
        }
    }
    validateOptions(schmea,options);
    let {filename,text} = options;
    if(text){
        return inputSource + options.text;
    }
    const callback = this.async();

    if(filename){
        fs.readFile(filename,'utf8',(err,text)=>{
             callback(null,inputSource + text,inputSourceMap)   
        })
    }
    return inputSource
}

module.exports = loader;