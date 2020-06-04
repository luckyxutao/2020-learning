import { TAG_ROOT, ELEMENT_TEXT, TAG_TEXT, TAG_HOST, PLACEMENT } from "./constant";
import { setProps } from './utils';
/*
1. 从根节点开始渲染和调度
2. diff阶段可以暂停
2. commit 不可以

*/
let nextUnitOfWork = null;
let workInProgressRoot = null;
/*
1. 生成fiber树
2. 收集effectlist
*/
export function scheduleRoot(rootFiber) {
    workInProgressRoot = rootFiber;
    nextUnitOfWork = rootFiber;
}
function performUnitOfWork(currentFiber) {
    //currentFiber还没有child
    beginWork(currentFiber);
    //有child
    if (currentFiber.child) {
        return currentFiber.child;
    }
    while (currentFiber) {
        //当前结束，再找弟弟。
        //因为没有child也就意味着没有child.sibling，因此当前节点可以完成
        completeUnitOfWork(currentFiber);
        if (currentFiber.sibling) {
            return currentFiber.sibling;
        }
        currentFiber = currentFiber.return;
    }
}
function completeUnitOfWork(currentFiber) {
    //第1  A1(TEXT),   
    let returnFiber = currentFiber.return;//A1(Tag);
    if (returnFiber) {
        //把当前节点的first\last挂到爷爷身上
        if (!returnFiber.firstEffect) {
            returnFiber.firstEffect = currentFiber.firstEffect;
            returnFiber.lastEffect = currentFiber.lastEffect;
        }
        if (currentFiber.lastEffect) {
            //如果parent有lasteffect
            //归并
            if (returnFiber.lastEffect) {
                returnFiber.lastEffect.nextEffect = currentFiber.firstEffect;
                returnFiber.lastEffect = currentFiber.lastEffect;
            }
        }

        const effectTag = currentFiber.effectTag;
        //如果当前fiber有effectTag,当前没有则不需要
        if (effectTag) {
            //如果parent有last
            if (!returnFiber.firstEffect) {
                returnFiber.firstEffect = currentFiber;
                returnFiber.lastEffect = currentFiber;
            } else {
                //C2-> B1 = A1.last
                returnFiber.lastEffect.nextEffect = currentFiber;
                returnFiber.lastEffect = currentFiber;
            }

        }

    } else {

    }
}
/*
开始收下线钱
completeWor 把下线钱收完了
1. 创建真实dom
2. 创建fiber
*/
function beginWork(currentFiber) {
    if (currentFiber.tag === TAG_ROOT) {
        updateHostRoot(currentFiber);
    } else if (currentFiber.tag === TAG_TEXT) {
        updateHostText(currentFiber);
    } else if (currentFiber.tag === TAG_HOST) {
        updateHost(currentFiber);
    }
}

function createDOM(currentFiber) {
    if (currentFiber.tag === TAG_TEXT) {
        //fiber.props == element.props;
        return document.createTextNode(currentFiber.props.text)
    } else if (currentFiber.tag === TAG_HOST) {
        let stateNode = document.createElement(currentFiber.type);//div
        updateDOM(stateNode, {}, currentFiber.props);
        return stateNode;
    }
}

function updateDOM(stateNode, oldProps, newProps) {
    setProps(stateNode, oldProps, newProps);
}

//222
function updateHostText(currentFiber) {
    if (!currentFiber.stateNode) {
        currentFiber.stateNode = createDOM(currentFiber);
    }

}
//<div>2222</div>
function updateHost(currentFiber) {
    if (!currentFiber.stateNode) {
        currentFiber.stateNode = createDOM(currentFiber);
    }
    const newChildren = currentFiber.props.children;
    reconcilerChildren(currentFiber, newChildren);
}
function updateHostRoot(currentFiber) {
    let newChildren = currentFiber.props.children; //[element]
    reconcilerChildren(currentFiber, newChildren);
}
/*
    begin是创建fiber
    complete是收集effetc
*/
function reconcilerChildren(currentFiber, newChildren) {
    let newChildIndex = 0;
    let prevSibling;//上一个新的子fiber
    while (newChildIndex < newChildren.length) {
        let newChild = newChildren[newChildIndex];
        let tag;
        //本文节点
        if (newChild.type === ELEMENT_TEXT) {
            tag = TAG_TEXT;
            //原生dom
        } else if (typeof newChild.type === 'string') {
            tag = TAG_HOST
        }
        //newChild是虚拟DOM
        let newFiber = {
            tag,
            type: newChild.type,//div
            props: newChild.props, //[element]
            stateNode: null, //div还没有创建dom元素
            return: currentFiber,
            effectTag: PLACEMENT,//类型收集副作用，dom操作
            nextEffect: null, //effectList是一个单链表,顺序和完成的顺序是一样的，节点可能会少

        }
        if (newFiber) {
            if (newChildIndex === 0) {
                currentFiber.child = newFiber;
            } else {
                prevSibling.sibling = newFiber;
            }
        }
        prevSibling = newFiber;
        newChildIndex++;
    }
}


function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }
    if (!nextUnitOfWork) {
        debugger
        commitRoot();
        console.log('render结束')
    } else {
        requestIdleCallback(workLoop, { timeout: 500 })
    }
}

function commitRoot() {
    //C1
    // debugger
    let currentFiber = workInProgressRoot.firstEffect;
    while (currentFiber) {
        commitWork(currentFiber);
        currentFiber = currentFiber.nextEffect;
    }
}

function commitWork(currentFiber) {
    if(!currentFiber){
        return;
    }
    let returnFiber = currentFiber.return;
    //父亲DOM，父亲fiber
    let returnDOM = returnFiber.stateNode;
    if(currentFiber.effectTag === PLACEMENT){
        returnDOM.appendChild(currentFiber.stateNode);
    }
    // returnFiber.effectTag = null;
}

requestIdleCallback(workLoop, { timeout: 500 });
