let fs = require('fs');
let path = require('path');
function createLoaderObject(loader) {
    let obj = {};//data是一自定义对象，可以在pitch和normal之间传递数据
    obj.data = {};
    obj.request = loader;//loader的路径
    obj.normal = require(loader);//真正的loader函数了
    obj.pitch = obj.normal.pitch;//pitch属性
    return obj;
}
function runLoaders(options, callback) {
    debugger
    var resource = options.resource || "";//要加载的资源
    var loaders = options.loaders || [];//走哪些loader
    var loaderContext = options.context || {};//loader在执行的时候处于的上下文对象 loaderIndex
    var readResource = options.readResource || fs;//读取文件 方法

    loaders = loaders.map(createLoaderObject);
    loaderContext.loaderIndex = 0;//当前指向的loader索引
    loaderContext.readResource = readResource;// fs.readFile
    loaderContext.resource = resource;// ./src/index.js
    loaderContext.loaders = loaders;//所有的loader
    let isSync = true;//默认是同步的，会自动向后执行下一个loader normal
    let innerCallback = loaderContext.callback = function (err, args) {
        isSync = true;
        loaderContext.loaderIndex--;
        iterateNormalLoaders(loaderContext, args, callback);
    }
    loaderContext.async = function () {
        isSync = false;//一旦我们调用了async 方法，就立刻变成异步，不再自动执行下一个normal loader了
        return innerCallback;
    }
    //request代表完整的请求路径 包括 loader和要加载的资源
    Object.defineProperty(loaderContext, "request", {
        get() {
            return loaderContext.loaders.map(item => item.request)
                .concat(loaderContext.resource).join('!')
        }
    })
    Object.defineProperty(loaderContext, "remainingRequest", {
        get() {
            return loaderContext.loaders
                .slice(loaderContext.loaderIndex + 1)
                .map(item => item.request)
                .concat(loaderContext.resource).join('!')
        }
    })
    //currentRequest从现在这个loader开始的
    Object.defineProperty(loaderContext, "currentRequest", {
        get() {
            return loaderContext.loaders
                .slice(loaderContext.loaderIndex)
                .map(item => item.request)
                .concat(loaderContext.resource).join('!')
        }
    })
    Object.defineProperty(loaderContext, "previousRequest", {
        get() {
            return loaderContext.loaders
                .slice(0, loaderContext.loaderIndex)
                .map(item => item.request).join('!')
        }
    })
    Object.defineProperty(loaderContext, "data", {
        get() {
            return loaderContext.loaders[loaderContext.loaderIndex].data;
        }
    })
    iteratePitchingLoaders(loaderContext, callback);
    function processResource(loaderContext, callback) {
        let buffer = loaderContext.readResource.readFileSync(loaderContext.resource, 'utf8');// ./src/index.js
        iterateNormalLoaders(loaderContext, buffer, callback);
    }
    function iterateNormalLoaders(loaderContext, args, callback) {
        if (loaderContext.loaderIndex < 0) {
            return callback(null, args);
        }
        let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];//loader1 object
        let fn = currentLoaderObject.normal;//pitch1 loader1.pitch
        args = fn.apply(loaderContext, [args]);

        if (isSync) {//执行完当前的loader，如果是同步模式的话，会自动向下执行下一个loader,如果是异步模式的话，不再自动执行
            loaderContext.loaderIndex--;
            iterateNormalLoaders(loaderContext, args, callback);
        }
    }
    function iteratePitchingLoaders(loaderContext, callback) {
        //如果走到这说明越界了，说明loader的pitch已经全部执行完了
        if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
            loaderContext.loaderIndex--;
            return processResource(loaderContext, callback);
        }
        let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];//loader1 object
        let fn = currentLoaderObject.pitch;//pitch1 loader1.pitch
        if (!fn) {
            loaderContext.loaderIndex++;
            return iteratePitchingLoaders(loaderContext, callback);
        }
        let args = fn.apply(loaderContext, [loaderContext.remindingRequest, loaderContext.previousRequest, loaderContext.data]);
        if (args) {
            loaderContext.loaderIndex--;
            iterateNormalLoaders(loaderContext, args, callback);
        } else {
            loaderContext.loaderIndex++;
            iteratePitchingLoaders(loaderContext, callback);
        }
    }
}
module.exports = runLoaders;