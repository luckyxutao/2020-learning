let socket = io('/');
const Emitter = require('./EventEmitter');

const hotEmitter = new Emitter();
let hotCurrentHash;
let newCurrentHash;
const onConnected = () => {
    console.log('客户端已经连接');
    //1. `webpack-dev-server/client`端会监听到此hash消息
    socket.on('hash', (hash) => {
        newCurrentHash = hash;
    });
    //2. 客户端收到`ok`的消息后会执行`reloadApp`方法进行更新
    socket.on('ok', () => {
        reloadApp(true);
    });
    socket.on('disconnect', () => {
        hotCurrentHash = newCurrentHash = null;
    });
}
// 3. 在reloadApp中会进行判断，是否支持热更新，如果支持的话发射`webpackHotUpdate`事件,如果不支持则直接刷新浏览器
function reloadApp(hot) {
    if (!hot) {
        return window.location.reload();
    }
    hotEmitter.emit('webpackHotUpdate');
}

//4. 在`webpack/hot/dev-server.js`会监听`webpackHotUpdate`事件,在监听里会调用hotCheck方法
hotEmitter.on("webpackHotUpdate", function () {
    if (!hotCurrentHash || hotCurrentHash === newCurrentHash) {
        return hotCurrentHash = newCurrentHash;
    }
    //5. 在check方法里会调用`module.hot.check`方法
    hotCheck();
});
function hotCheck() {
    //6. 它通过调用 `JsonpMainTemplate.runtime`的`hotDownloadManifest`方法，向 server 端发送 Ajax 请求，服务端返回一个 `Manifest`文件，该 `Manifest` 包含了所有要更新的模块的 `hash` 值和chunk名
    hotDownloadManifest().then(update => {
        let chunkIds = Object.keys(update.c);
        chunkIds.forEach((chunkId) => {
            //7. 调用`JsonpMainTemplate.runtime`的`hotDownloadUpdateChunk`方法通过JSONP请求获取到最新的模块代码
            hotDownloadUpdateChunk(chunkId);
        });
    });
}

function hotDownloadUpdateChunk(chunkId) {
    var script = document.createElement("script");
    script.charset = "utf-8";
    script.src = "/" + chunkId + "." + hotCurrentHash + ".hot-update.js";
    document.head.appendChild(script);
}
function hotDownloadManifest() {
    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        var requestPath = "/" + hotCurrentHash + ".hot-update.json";
        request.open("GET", requestPath, true);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                let update = JSON.parse(request.responseText);
                resolve(update);
            }
        }
        request.send();
    });
}

window.hotCreateModule = function(){
    var hot = {
        _acceptedDependencies: {},
        accept: function(dep, callback) {
          for (var i = 0; i < dep.length; i++){
              /*
              hot._acceptedDependencies = {
                  './title': render
              }
              */
            hot._acceptedDependencies[dep[i]] = callback;
          }
        }
  }
  return hot;
}

//9. 补丁JS取回来后会调用`JsonpMainTemplate.runtime.js`的`webpackHotUpdate`方法，里面会调用`hotAddUpdateChunk`方法,用新的模块替换掉旧的模块
//10. 然后会调用`HotModuleReplacement.runtime.js`的`hotAddUpdateChunk`方法动态更新模块代码
//11. 然后调用`hotApply`方法进行热更新
window.webpackHotUpdate = (chunkId, moreModules) => {
    for (let moduleId in moreModules) {
        //找到旧的已经加载过的模块
        let oldModule = __webpack_require__.c[moduleId];
        let { parents, children } = oldModule;
        //了出parents和children
        //新为新补丁包装一个module
        var module = __webpack_require__.c[moduleId] = {
            i: moduleId,
            l: false, exports: {},
            parents, children,
            hot: window.hotCreateModule(moduleId)
        };
        moreModules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.l = true;
        parents.forEach(parent => {
            let parentModule = __webpack_require__.c[parent];
            parentModule.hot && parentModule.hot._acceptedDependencies[moduleId] && parentModule.hot._acceptedDependencies[moduleId]();
        });
        hotCurrentHash = newCurrentHash;
    }
}
socket.on('connect', onConnected);