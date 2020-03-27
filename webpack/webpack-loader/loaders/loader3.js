function loader(source){
    console.log('loader333')
    return source + '//333';
}
loader.pitch = function(){
    console.log('pit333')
}
module.exports = loader;