let entry = './src/index.js';
let path = require('path');
let options = {
    resource : path.resolve(__dirname,entry),
    loaders:[
        path.resolve(__dirname,'loader1.js'),
        path.resolve(__dirname,'loader2.js'),
        path.resolve(__dirname,'loader3.js'),
    ]
}
function createLoaderObj(loader){
    let loaderObj = { data : {}};
    loaderObj.request = loader;//文件绝对 路径
    loaderObj.normal = require(loader);
    loaderObj.pitch = loaderObj.normal.pitch;
    return loaderObj;
}
function runLoaders(options,callback){
    let loaderContext = {};
    let resource = options.resource;
    let loaders = options.loaders;
    loader = loaders.map(createLoaderObj);
    loaderContext.loaderIndex = 0;
    loaderContext.readResource = readFile;
    loaderContext.resource = resource;
    loaderContext.loaders = loaders;
    iteratePitchingLoader(loaderContext,callback)
}
function iteratePitchingLoader(loaderContext,callback){
    if(loaderContext.loaderIndex >= loaderContext.loaders.length){
        loaderContext.loaderIndex--;
        interateNormalLoaders(loaderContext,result,callback);
    }
    let currentLoaderObject =  loaderContext.loaders[loaderContext.loaderIndex];
    let pitchFn = currentLoaderObject.pitch;
    if(!pitchFn){
        loaderContext.loaderIndex++;
        iteratePitchingLoader(loaderContext,callback)
    }
    let result = pitchFn.apply(loaderContext);
    if(result){ //如果pitch有返回值
        loaderContext.loaderIndex--;
        interateNormalLoaders(loaderContext,result,callback);
    } else {
        loaderContext.loaderIndex++;
        iteratePitchingLoader(loaderContext,callback)
    }
}
runLoaders(options,(err,result)=>{

});