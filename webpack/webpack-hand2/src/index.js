document.getElementById('button').addEventListener('click',function(e){
    import('./title').then(result => {
        console.log(result.default);
    });
})
