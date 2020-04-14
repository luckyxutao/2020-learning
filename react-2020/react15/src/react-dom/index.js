import { createDOM} from '../react/vdom';

function render(element,container){
    //1. element变成真实dom
    //2. 直接dom挂到container
    let dom = createDOM(element);
    container.appendChild(dom);
}

export default {
    render
}