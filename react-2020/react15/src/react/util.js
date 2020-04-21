import { addEvent } from './event';

export function onlyOne(obj) {
    return Array.isArray(obj) ? obj[0] : obj;
}


export function setProps(dom, props) {
    for (let key in props) {
        if (props.hasOwnProperty(key)) {
            if (!['key', 'children'].includes(key)) {
                setProp(dom, key, props[key]);
            }
        }
    }
}

export function patchProps(ele, oldProps, newProps) {
    //把新的属性覆盖旧的,复用旧元素
    //旧的是 a bc  新的是 b e f
    // a c 删除，b覆盖新的
    for (let key in oldProps) {
        if (key !== 'children') {
            if (!newProps.hasOwnProperty(key)) {//新的没有，直接删除
                ele.removeAttribute(key)
            }
        }
    }
    for (let key in newProps) {
        if (key !== 'children') {
            setProp(ele, key, newProps[key]);
        }
    }
}


function setProp(dom, key, value) {
    if (/^on/.test(key)) {
        addEvent(dom, key, value);
    } else if (key === 'style') {
        for (let styleName in value) {
            if (value.hasOwnProperty(styleName)) {
                dom.style[styleName] = value[styleName];
            }
        }
    } else {
        dom.setAttribute(key, value);
    }
}

export function isFunction(obj) {
    return typeof obj === 'function';
}

export function flattern(array) {
    var res = [];
    traverseAll(array, res);
    return res;
}
function traverseAll(arr, res) {
    if (!Array.isArray(arr)) {
        res.push(arr);
        return;
    }
    for (let i = 0; i < arr.length; i++) {
        traverseAll(arr[i], res);
    }
}