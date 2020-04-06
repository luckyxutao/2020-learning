let button = document.createElement('button');
button.innerHTML = '点我';
button.addEventListener('click',()=>{
    // 动态导入 类比路由的懒加载 import
    // 默认会产生代码分割
    // 使用jsonp异步加载 ./calc
    // webpackChunkName改 异步文件名
    import('./title').then(res=>{
        console.log(res.default)
    });
    import('./ccc').then(res=>{
        console.log(res.default)
    })
});
document.body.appendChild(button);