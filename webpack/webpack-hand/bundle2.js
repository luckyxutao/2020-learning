(function (modules) {
    var installedModules = {};
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
    return __webpack_require__('./src/index.js')
})({
    './src/index.js': function (module, __webpack_exports__, __webpack_require__) {
        let title = __webpack_require__('./src/title.js');
        console.log(title['default']);
    },
    './src/title.js': function (module, __webpack_exports__, __webpack_require__) {
        __webpack_exports__['default'] = 22222222 //整个覆盖是不可能的
        //比如 __webpack_exports__ = 333333;
        //可以 __webpack_exports__.cccc = 2333 修改
    }
})