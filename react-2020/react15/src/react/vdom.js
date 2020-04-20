import { REACT_ELEMENT_TYPE, CLASS_COMPONENT, FUNCTION_COMPONENT } from '../shared/ReactSymbols';
import { onlyOne, setProps } from './util';
function createDOM(element) {
    element = onlyOne(element);
    let { $$typeof } = element;
    let dom;
    if (!$$typeof || element === 'string') {
        dom = document.createTextNode(element);
    } else if ($$typeof === REACT_ELEMENT_TYPE) {
        dom = createNativeDOM(element);
    } else if ($$typeof === FUNCTION_COMPONENT) {
        dom = createFunctionDOM(element);
    } else if ($$typeof === CLASS_COMPONENT) {
        dom = createClassComponentDOM(element);
    }
    return dom;
}
/**
 * 
 * {
 *    type : function(){},
 *    props
 * }
 */
//创建函数组件对应的dom对象
function createFunctionDOM(element) {
    let { type, props } = element;
    //执行函数组件，得到该组件的虚拟dom
    let renderElement = type(props);
    element.renderElement = renderElement;
    let newDom = createDOM(renderElement);
    renderElement.dom = newDom;
    return newDom;
}
/*
{
  $$typeof: Symbol(react.element)
  key: null
  props: {}        // props有child屬性, 描述子組件, 同樣是元素
  ref: null
  type: class C    // type可以是類(自定義組件)、函數(wrapper)、string(DOM節點)
  _owner: null
  _store: {validated: false}
  _self: null
  _source: null
}
*/
function createClassComponentDOM(element) {
    let { type, props } = element;
    let componentInstance = new type(props);
    element.componentInstance = componentInstance;
    let renderElement = componentInstance.render();
    let newDom = createDOM(renderElement);
    return newDom;
}


function createNativeDOM(element) {
    let { type, props } = element;
    let dom = document.createElement(type);
    createNativeDOMChildren(dom, props.children);
    setProps(dom, props);
    // 1. children
    // 2. 添加属性
    return dom;
}



function createNativeDOMChildren(parentNode, children) {
    if (Array.isArray(children)) {
        children && children.forEach(child => {
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