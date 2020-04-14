import { REACT_ELEMENT_TYPE } from '../shared/ReactSymbols';
import { onlyOne, setProps } from './util';
function createDOM(element) {
    element = onlyOne(element);
    let { $$typeof } = element;
    let dom;
    if (!$$typeof || element === 'string') {
        dom = document.createTextNode(element);
    } else if ($$typeof === REACT_ELEMENT_TYPE) {
        dom = createNativeDOM(element);
    }
    return dom;
}
function createNativeDOM(element) {
    let { type, props } = element;
    let dom = document.createElement(type);
    createNativeDOMChildren(dom, props.children);
    setProps(dom,props);
    // 1. children
    // 2. 添加属性
    return dom;
}



function createNativeDOMChildren(parentNode,children) {
    if(Array.isArray(children)){
        children&&children.forEach(child=>{
            let childDOM = createDOM(child);
            parentNode.appendChild(childDOM);
        });
    } else {
        let childDOM = createDOM(children);
        parentNode.appendChild(childDOM);
    }
}
export {
    createDOM
}