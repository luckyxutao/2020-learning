function loader(source){
    console.log('loader111')
    return source + '//1';
}
loader.pitch = function(){
    console.log('pit111')
}
module.exports = loader;