(function (modules) {
    var installedModules = {};
    var installedChunks = {
        "main": 0
    };
    function webpackJsonpCallback(data) {
        let chunkIds = data[0];
        let moreModules = data[1];
        let resolves = [];
        for (let i = 0; i < chunkIds.length; i++) {
            let chunkId = chunkIds[i];
            resolves.push(installedChunks[chunkId][0]); // installedChunks[chunkId] = [resolve,reject,promise]
            installedChunks[chunkId] = 0; //0表示已经加载成功
        }
        for (moduleId in moreModules) {
            modules[moduleId] = moreModules[moduleId];//把模块合并到 modules
        }
        if (parentJsonpFunction) parentJsonpFunction(data);
        while (resolves.length) {
            resolves.shift()();
        }
    }
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId];
        }
        var module = installedModules[moduleId] = {
            exports: {},
            l: false,
            i: moduleId
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        return module.exports;
    }

    // Object.prototype.hasOwnProperty.call
    __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

    //往exports上定义属性
    __webpack_require__.d = function (exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, { enumerable: true, get: getter });
        }
    };

    //mode为什么 要用二进制
    // __webpack_require__.t = function(value,mode){//7 1+2+4=7
    //     value = __webpack_require__(value); //title
    //     return value;
    // }

    //保证肯定是个es6对象，且有title属性
    __webpack_require__.t = function (value, mode) {
        if (mode & 1) value = __webpack_require__(value);
        if (mode & 8) return value;
        if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
        var ns = Object.create(null);
        __webpack_require__.r(ns);
        Object.defineProperty(ns, 'default', { enumerable: true, value: value });
        if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
        return ns;
    };
    // define __esModule on exports
    __webpack_require__.r = function (exports) {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        }
        Object.defineProperty(exports, '__esModule', { value: true });
    };
    __webpack_require__.e = function (chunkId) {
        var installChunkData = installedChunks[chunkId];//取得老的代码块数据
        let promise = new Promise((resolve, reject) => {
            installChunkData = installedChunks[chunkId] = [resolve, reject];
        });
        installChunkData[2] = promise; //[resolve,reject,promise]

        var script = document.createElement('script');
        script.src = chunkId + '.bundle.js';
        document.head.appendChild(script);
        return promise;
    }
    var jsonArray = (window['webpackJsonp'] = window['webpackJsonp'] || []);
    var oldJsonpFunction = jsonArray.push.bind(jsonArray);
    var parentJsonFunction = oldJsonpFunction //老数据的push方法
    //重写jsonArray的push方法
    jsonArray.push = webpackJsonpCallback;
    return __webpack_require__('./src/index.js')
})({
    './src/index.js': function (module, exports, __webpack_require__) {

        let button = document.createElement('button');
        button.innerHTML = '点我';
        button.addEventListener('click', () => {
            // 动态导入 类比路由的懒加载 import
            // 默认会产生代码分割
            // 使用jsonp异步加载 ./calc
            // webpackChunkName改 异步文件名
            __webpack_require__.e(/*! import() */ 0).then(__webpack_require__.t.bind(null, /*! ./title */ "./src/title.js", 7)).then(res => {
                console.log(res.default)
            })
        });
        document.body.appendChild(button);
    }
})