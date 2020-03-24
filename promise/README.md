const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
    reject('error')
  }, 1000)
})
promise.then((res)=>{
  console.log(res)
},(err)=>{
  console.log(err)
})

作者：lunlunshiwo
链接：https://juejin.im/post/5ad3fa47518825619d4d3a11
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。