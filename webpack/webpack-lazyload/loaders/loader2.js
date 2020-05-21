function loader(inputSource) {
    console.log('inline_loader2');
    return inputSource + '//loader2';
}
loader.pitch = function(remindingRequest,prevRequest,data){
    console.log('inline_patch2');
    
}
module.exports = loader;