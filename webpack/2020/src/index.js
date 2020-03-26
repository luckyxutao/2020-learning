// import React from 'react';
// import { render} from 'react-dom';
// import './index.css';
// // import $ from 'jQuery';

// render(<h1>aaaa</h1>,document.getElementById('root'));

let button = document.createElement('button');
// import { add } from './calc';
button.innerHTML = '点我';
button.addEventListener('click',()=>{
    // 动态导入 类比路由的懒加载 import
    // 默认会产生代码分割
    // 使用jsonp异步加载 ./calc
    // webpackChunkName改 异步文件名
    import(/* webpackChunkName: "my-chunk-name" */'./calc').then(res=>{
        console.log(res.add(23,32))
    })
});

document.body.appendChild(button);
// // // tree-shaking 默认只支持
// // import { minus} from './calc';
// // import test from './test';
// import d from './d';
// console.log(d)