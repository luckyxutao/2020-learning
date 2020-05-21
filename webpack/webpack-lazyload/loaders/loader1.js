function loader(inputSource) {
    console.log('inline_loader1');
    
    return inputSource + '//loader1';
}
loader.pitch = function(remindingRequest,prevRequest,data){
    console.log('inline_patch1');
    
}
module.exports = loader;