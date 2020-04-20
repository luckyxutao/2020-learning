import { REACT_ELEMENT_TYPE, CLASS_COMPONENT, FUNCTION_COMPONENT } from '../shared/ReactSymbols';
import { onlyOne, setProps, patchProps } from './util';
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
    componentInstance.renderElement = renderElement;
    let newDom = createDOM(renderElement);
    renderElement.dom = newDom;
    return newDom;
}

export function compareTwoElements(oldElement, newElement) {
    oldElement = onlyOne(oldElement);
    newElement = onlyOne(newElement);
    let currentDOM = oldElement.dom;
    let currentElement = oldElement;
    //dom对比算法，如果类型相同
    if (newElement === null) {
        currentDOM.parentNode.removeChild(currentDOM);
        currentElement = null;
    } else if (oldElement.type !== newElement.type) {
        let newDOM = createDOM(newElement);
        currentDOM.parentNode.replacChild(newDOM, currentDOM);
        currentDOM = newElement;
    } else { //真正虚拟dom对比，如果type和key都一致才复用
        updateElement(oldElement, newElement);
    }
    return currentElement;
}

function textElement(element) {
    return typeof element === 'string' && !element.$$typeof;
}
//走到这步说明已经达到复用的条件了
function updateElement(oldElement, newElement) {
    //
    let currentDOM = newElement.dom = oldElement.dom;
    //如果都是文本类型，直接替换
    if (textElement(oldElement) && textElement(newElement)) {
        if (oldElement !== newElement) {
            currentDOM.textContent = newElement;
        } //如果是元素类型(div,span)
    } else if (oldElement.$$typeof === REACT_ELEMENT_TYPE) {
        updateDOMProperties(currentDOM, oldElement.props, newElement.props);
        updateChildrenElements(currentDOM,oldElement.props.children,newElement.props.children);
        oldElement.props = newElement.props; //更新props
    } else if (oldElement.$$typeof === CLASS_COMPONENT) {
        updateClassComponent(oldElement, newElement);
    } else if (oldElement.$$typeof === FUNCTION_COMPONENT) {
        updateFunctionComponent(oldElement, newElement);
    }
}
function updateChildrenElements(dom, oldChildrenElements, newChildrenElement) {
    // diff(dom, oldChildrenElements, newChildrenElement);
}
function updateDOMProperties(dom, oldProps, newProps) {
    patchProps(dom, oldProps, newProps);
}
function updateClassComponent(oldElement, newElement) {
    let componentInstance = oldElement.componentInstance;
    let updater = componentInstance.$updater;
    let nextProps = newElement.props;
    updater.emitUpdate(nextProps);
}
// 1. 拿到老元素
// 2. 重新执行函数组件拿到新元素
// 3. 现对比
function updateFunctionComponent(oldElement,newElement){
    let newRenderElement = new newElement(newElement.props);
    let oldRenderElement = oldElement.renderElement;
    let currentElement = compareTwoElements(oldRenderElement,newRenderElement);
    newElement.renderElement = currentElement;
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