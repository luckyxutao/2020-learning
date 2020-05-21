let hello = require('./hello.js');
console.log(hello);

// // require('loader1!loader2!loader3!./hello.js')
// import './style.css'
// // const re = require('./assets/11.jpg')
// // console.log(re);


// let button = document.createElement('button');
// button.innerHTML = '点我';
// button.addEventListener('click',()=>{
//     import(
//         /* webpackChunkName: 'hello' */
//         /* webpackPrefetch: true */
//         './hello'
//         ).then(res=>{
//         console.log(res.default);
//     });
//     import(
//         /* webpackChunkName: 'world' */
//         /* webpackPrefetch:true */
//         './world').then(res=>{
//         console.log(res.default);
//     })
// });
// document.body.appendChild(button);