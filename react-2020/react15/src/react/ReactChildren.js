import {ReactElement} from './ReactElement'
function mapChildren(children, callback, context) {
    //TODO实现此mapChildren方法
    var newChildren = [];
    var indexObj = { index: 0 };//需要是个引用类型，值类型的话，递归函数内修改了，但是外边不知道，仍然以旧值循环
    traversalAll(children, newChildren, indexObj, callback);
    return newChildren;
}

function traversalAll(children, res, indexObj, callback, prefix = '') {
    if (!children) {
        return null;
    }
    if (Array.isArray(children)) {
        for (let k = 0; k < children.length; k++) {
            let spelator = prefix ? ':' : '.'
            let newPrefixName = prefix + spelator + k;
            traversalAll(children[k], res, indexObj, callback, newPrefixName);
        }
    } else {
        // console.log(`${prefix}`);
        var oldElement = children;
        var clonedElement = ReactElement(oldElement.type, prefix, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
        res.push(callback(clonedElement, indexObj.index++))
    }
}
export {
    mapChildren as map,
};