import { createDOM} from '../react/vdom';
import {updateQueue} from '../react/ReactBaseClasses';
function render(element,container){
    //1. element变成真实dom
    //2. 直接dom挂到container
    let dom = createDOM(element);
    container.appendChild(dom);
}

export function unstable_batchedUpdates(fn){
    updateQueue.isPending = true;
    fn();
    updateQueue.isPending = false;
    updateQueue.batchUpdate();
}

export default {
    render,
    unstable_batchedUpdates
}