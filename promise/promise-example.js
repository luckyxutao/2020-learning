// const Promise = require('./my-promise');
let p1 = new Promise((resolve,reject)=>{
    setTimeout(() => {
        resolve('p111')
    }, 2000);
});
let p2 = new Promise((resolve,reject)=>{
    setTimeout(() => {
        resolve('pp222')
    }, 1000);
});
let p3 = new Promise((resolve,reject)=>{
    setTimeout(() => {
        resolve('p3333')
    }, 2000);
});


let gg = Promise.race([p1,p2,p3]).then(valuesArr=>{
    console.log(valuesArr)
},err=>{
    console.log('err',err)
})
