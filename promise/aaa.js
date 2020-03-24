

var p = new Promise((resolve, reject) => {
   setTimeout(() => {
       resolve('ok')
   }, 1000);
}).then(res=>{
    return Promise.reject('3333')
}).catch(res=>{
    console.log(res)
})
