let socket = io('/');
let currentHash;
let prevHash; //last
class Emmiter {
    constructor() {
        this.listeners = {};
    }
    on(type, lisener) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(lisener);
    }
    emit(type){
        const subsibers = this.listeners[type];
        subsibers.forEach(fn=>fn())
    }
}
const onConnected = () => {

};
let hotEmmiter = new Emmiter();
socket.on('hash', (hash) => {
    currentHash = hash;
});
socket.on('ok', () => {
    reloadApp(true);
});
hotEmmiter.on('webpackHotUpdate',()=>{
    if(!prevHash || prevHash === currentHash){
        return prevHash = currentHash;
    } else {
        hotCheck();
    }
});

function hotCheck(){
    hotDownloadManifest().then(update=>{
        let chunkIds = Object.keys(update.c);
        chunkIds.forEach(chunkId=>{
            hotDownloadUpdateChunk(chunkId);
        })
    });
}
//用来下载chunk更新
function hotDownloadUpdateChunk(chunkId){
    let script = document.createElement('script');
    script.charset = 'utf-8';
    //main.abdassss.hot-update.js
    script.src= `/${chunkId}.${prevHash}.hot-update.js`;
    document.head.appendChild(script);
}
//用来去询问服务器编译的区别 diff Pathc
function hotDownloadManifest(){
    return new Promise(resolve=>{
        let request = new XMLHttpRequest();
        //上次的hash
        //hot-update.json，有两个编译的差异
        let requestPath = '/' + prevHash + '.hot-update.json';
        request.open('GET',requestPath,true);
        request.onreadystatechange = function(){
            if(request.readyState === 4){
                let update = JSON.parse(request.responseText);
                resolve(update);
            }
        }
        request.send(null);

    });
}

function reloadApp(hot) {
    //如果hot为true,走热更新的逻辑
    if (hot) {
        hotEmmiter.emit('webpackHotUpdate', currentHash)
    } else {
        window.location.reload();
    }
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
window.webpackHotUpdate = function(chunkId,moreModules){
    for(let moduleId in moreModules){
        //找到缓存的模块对象
        let oldModule = __webpack_require__.c[moduleId]
        //哪些模拟引用了当前(parents), children，他引用了哪个模块
        let { parents, children } = oldModule;
        //更新缓存为最新代码
        let module = __webpack_require__.c[moduleId] = {
            i:moduleId,
            l:false,
            exports:{},
            parents,
            children,
            hot: window.hotCreateModule(moduleId)
        }
        moreModules[moduleId].call(module.exports,module,module.exports,__webpack_require__)
        module.l = true;
        parents.forEach(parent=>{
            let parentModule = __webpack_require__.c[parent];
            parentModule 
            && parentModule.hot
            && parentModule.hot._acceptedDependencies[moduleId]
            && parentModule.hot._acceptedDependencies[moduleId]()
        });
        prevHash = currentHash;
    }
}
socket.on('connect', onConnected)