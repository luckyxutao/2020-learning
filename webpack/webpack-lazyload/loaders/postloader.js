function loader(inputSource) {
    console.log('postloader');
    
    return inputSource + '//postloader';
}

module.exports = loader;