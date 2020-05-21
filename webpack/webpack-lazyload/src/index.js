let button = document.createElement('button');
button.innerHTML = '点我';
button.addEventListener('click',()=>{
    import(
        './hello.js'
        ).then(res=>{
        console.log(res.default);
    });
    import(
        './world.js').then(res=>{
        console.log(res.default);
    })
});
document.body.appendChild(button);