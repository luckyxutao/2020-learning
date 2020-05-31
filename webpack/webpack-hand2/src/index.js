let _ = require('lodash');
console.log(_.join([1, 2, 3]));
document.getElementById('button').addEventListener('click',function(e){
    import('./title').then(result => {
        console.log(result.default);
    });
})
