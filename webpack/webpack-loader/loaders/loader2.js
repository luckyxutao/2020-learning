function loader(source){
    console.log('loader222')
    return source + '//22';
}
loader.pitch = function(){
    console.log('pit2222')
    return 'result-pit2222'
}
module.exports = loader;