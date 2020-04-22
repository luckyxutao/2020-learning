import { REACT_ELEMENT_TYPE, CLASS_COMPONENT, FUNCTION_COMPONENT, TEXT } from '../shared/ReactSymbols';
import { onlyOne, setProps, patchProps } from './util';
const MOVE = 'MOVE';
const INSERT = 'INSERT';
const REMOVE = 'REMOVE';
const SET_MARKUP = 'SET_MARKUP';
let updateDepth = 0;
let diffQueue = [];//这是一个补丁包，记录了哪些节点需要删除 ，哪些节点需要添加
function createDOM(element) {
    element = onlyOne(element);
    let { $$typeof } = element;
    let dom;
    if (!$$typeof) {
        dom = document.createTextNode(element);
    } else if ($$typeof === TEXT) {
        dom = document.createTextNode(element.content);
    } else if ($$typeof === REACT_ELEMENT_TYPE) {
        dom = createNativeDOM(element);
    } else if ($$typeof === FUNCTION_COMPONENT) {
        dom = createFunctionDOM(element);
    } else if ($$typeof === CLASS_COMPONENT) {
        dom = createClassComponentDOM(element);
    }
    element.dom = dom;
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
    if (newElement === null) {//如果新组件是null，直接删除元素
        currentDOM.parentNode.removeChild(currentDOM);
        currentElement = null;
    } else if (oldElement.type !== newElement.type) {//type类型不同，无法复用
        let newDOM = createDOM(newElement);
        currentDOM.parentNode.replaceChild(newDOM, currentDOM);
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
    if (oldElement.$$typeof === TEXT && newElement.$$typeof === TEXT) {
        if (oldElement.content !== newElement.content) {
            currentDOM.textContent = newElement.content;
        } //如果是元素类型(div,span)
    } else if (oldElement.$$typeof === REACT_ELEMENT_TYPE) {
        updateDOMProperties(currentDOM, oldElement.props, newElement.props);
        // debugger
        updateChildrenElements(currentDOM, oldElement.props.children, newElement.props.children);
        oldElement.props = newElement.props; //更新props
    } else if (oldElement.$$typeof === CLASS_COMPONENT) {
        updateClassComponent(oldElement, newElement);
    } else if (oldElement.$$typeof === FUNCTION_COMPONENT) {
        updateFunctionComponent(oldElement, newElement);
    }
}

/**
 * 先更新和移动的都是子节点
 * 
 * 1. 先更新父节点还是先更新子节点? 先更新的是父节点
 * 2. 先移动父节点还是先移动子节点？ 先移动的是子节点
 */
function diff(parentNode, oldChildrenElements, newChildrenElements) {
    //oldChildrenElementsMap={G,A} newChildrenElementsMap={A,G}
    let oldChildrenElementsMap = getChildrenElementsMap(oldChildrenElements);//{A,B,C,D}
    let newChildrenElementsMap = getNewChildrenElementsMap(oldChildrenElementsMap, newChildrenElements);
    let lastIndex = 0;
    //比较是深度优先的，所以先放子节的补丁，再放父节点的补丁
    for (let i = 0; i < newChildrenElements.length; i++) {
        let newChildElement = newChildrenElements[i];
        if (newChildElement) {
            let newKey = newChildElement.key || i.toString();
            let oldChildElement = oldChildrenElementsMap[newKey];
            if (newChildElement === oldChildElement) {//说明他们是同一个对象，是复用老节点
                if (oldChildElement._mountIndex < lastIndex) {
                    diffQueue.push({
                        parentNode,//我要移除哪个父节点下的元素
                        type: MOVE,
                        fromIndex: oldChildElement._mountIndex,
                        toIndex: i
                    });
                }
                lastIndex = Math.max(oldChildElement._mountIndex, lastIndex);
            } else {//如果新老元素不相等，是直接 插入
                diffQueue.push({
                    parentNode,
                    type: INSERT,
                    toIndex: i,
                    dom: createDOM(newChildElement)
                });
            }
            newChildElement._mountIndex = i;//更新挂载索引
        } else {//newChildElement==null
            let newKey = i.toString();
            if (oldChildrenElementsMap[newKey].componentInstance && oldChildrenElementsMap[newKey].componentInstance.componentWillUnmount) {
                oldChildrenElementsMap[newKey].componentInstance.componentWillUnmount();
            }
        }
    }
    for (let oldKey in oldChildrenElementsMap) {
        if (!newChildrenElementsMap.hasOwnProperty(oldKey)) {
            let oldChildElement = oldChildrenElementsMap[oldKey];
            diffQueue.push({
                parentNode,
                type: REMOVE,
                fromIndex: oldChildElement._mountIndex//3
            });
        }
    }
}

function getNewChildrenElementsMap(oldChildrenElementsMap, newChildrenElements) {
    let newChildrenElementsMap = {};
    for (let i = 0; i < newChildrenElements.length; i++) {
        let newChildElement = newChildrenElements[i];//是有可能是null的
        if (newChildElement) {
            let newKey = newChildElement.key || i.toString();//A
            let oldChildElement = oldChildrenElementsMap[newKey];
            //可以复用1.key一样 2 需要类型是一样的
            if (canDeepCompare(oldChildElement, newChildElement)) {
                updateElement(oldChildElement, newChildElement);//复用老的DOM节点，用新属性更新这个DOM节点
                newChildrenElements[i] = oldChildElement;
            }
            newChildrenElementsMap[newKey] = newChildrenElements[i];
        }
    }
    return newChildrenElementsMap;
}

function canDeepCompare(oldChildElement, newChildElement) {
    if (!!oldChildElement && !!newChildElement) {// $$typeof ELEMENT type span div
        return oldChildElement.type === newChildElement.type;//如果类型一样，就可以复用了，可以进行深度对比了
    }
    return false;
}

function getChildrenElementsMap(oldChildrenElements) {
    let oldChildrenElementsMap = {};
    for (let i = 0; i < oldChildrenElements.length; i++) {
        let oldKey = oldChildrenElements[i].key || i.toString();
        oldChildrenElementsMap[oldKey] = oldChildrenElements[i];
    }
    return oldChildrenElementsMap;
}
function updateChildrenElements(dom, oldChildrenElements, newChildrenElements) {
    updateDepth++;//每进入一个新的子层级，就让updateDepth++
    diff(dom, oldChildrenElements, newChildrenElements);
    updateDepth--;//每比较完一层，返回上一级的时候，就updateDepth--
    if (updateDepth === 0) {//updateDepth等于，就说明回到最上面一层了，整个更新对比就完事了
        patch(diffQueue);//把收集到的差异 补丁传给patch方法进行更新
        // console.log(diffQueue)
        diffQueue.length = 0;
    }
}

function patch(diffQueue) {
    let deleteMap = {};
    let deleteChildren = [];
    for (let i = 0; i < diffQueue.length; i++) {
        let difference = diffQueue[i];
        let { type, fromIndex, toIndex, parentNode } = difference;
        if (type === MOVE || type === REMOVE) {
            let oldDOM = parentNode.children[fromIndex];
            deleteMap[fromIndex] = oldDOM;
            deleteChildren.push(oldDOM);
        }
    }
    deleteChildren.forEach(delDOM => {
        delDOM.parentNode.removeChild(delDOM);
    });

    for (let i = 0; i < diffQueue.length; i++) {
        let { type, fromIndex, toIndex, parentNode, dom } = diffQueue[i];
        switch (type) {
            case INSERT:
                insertChildAt(parentNode, dom, toIndex);
                break;
            case MOVE:
                insertChildAt(parentNode, deleteMap[fromIndex], toIndex)
                break;
            default:
                break;
        }
    }
}

function insertChildAt(parentNode, newChildDOM, index) {
    let oldChild = parentNode.children[index];//先取出这个索引位置的老的DOM节点
    oldChild ? parentNode.insertBefore(newChildDOM, oldChild) : parentNode.appendChild(newChildDOM);
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
function updateFunctionComponent(oldElement, newElement) {
    let newRenderElement = new newElement(newElement.props);
    let oldRenderElement = oldElement.renderElement;
    let currentElement = compareTwoElements(oldRenderElement, newRenderElement);
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
        children && children.forEach((child, i) => {
            let childDOM = createDOM(child);
            child._mountIndex = i;
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