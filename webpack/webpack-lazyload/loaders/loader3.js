function loader(inputSource) {
    console.log('inline_loader3');
    return inputSource + '//loader3';
}
loader.pitch = function(remindingRequest,prevRequest,data){
    console.log('inline_patch3');
    // return '//i am last';
    
}
module.exports = loader;