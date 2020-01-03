function cssLoader(content) {
    return content;
}

function styleLoader(content){
    let style = document.createElement('style');
    style.innerHTML = content;
    document.head.appendChild(style);
}