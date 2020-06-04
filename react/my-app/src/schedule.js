import { TAG_ROOT, ELEMENT_TEXT, TAG_TEXT, TAG_HOST, PLACEMENT, UPDATE, DELETION } from "./constant";
import { setProps } from './utils';
/*
1. 从根节点开始渲染和调度
2. diff阶段可以暂停
2. commit 不可以

*/
let nextUnitOfWork = null;
let workInProgressRoot = null;
let currentRoot = null;//渲染成功后，当前TREE
let deletions = [];//删除节点不在effectList
/*
1. 生成fiber树
2. 收集effectlist
*/
export function scheduleRoot(rootFiber) {
    //至少是第三次了
    if(currentRoot && currentRoot.alternate){
        //第三次用第一次的tree
        workInProgressRoot = currentRoot.alternate;
        workInProgressRoot.props = rootFiber.props;
        workInProgressRoot.alternate = currentRoot;
    }
    //至少渲染了一次，通过alternate来diff的
    if (currentRoot) {
        rootFiber.alternate = currentRoot;
        workInProgressRoot = rootFiber;
    } else {//第一次渲染
        workInProgressRoot = rootFiber;
    }
    workInProgressRoot.firstEffect = workInProgressRoot.lastEffect = workInProgressRoot.nextEffect = null;
    //第一次渲染
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
    newChileren = [element,element] vdom
*/
function reconcilerChildren(currentFiber, newChildren) {
    //如果当前fiber有alternamte，并且有child属性
    // div(#A1)，只是指向第一个而忆
    let oldFiber = currentFiber.alternate && currentFiber.alternate.child; 
    
    
    let newChildIndex = 0;
    let prevSibling;//上一个新的子fiber
    while (newChildIndex < newChildren.length || oldFiber) {
        let newChild = newChildren[newChildIndex];
        let newFiber;
        const sameType =  oldFiber && newChild && oldFiber.type === newChild.type;
        let tag;
        //因为oldFiber存在，可能会出现oldFiber有，新的没有，但是循环也走进来 了
        //本文节点
        if (newChild && newChild.type === ELEMENT_TEXT) {
            tag = TAG_TEXT;
            //原生dom
        } else if (newChild && typeof newChild.type === 'string') {
            tag = TAG_HOST
        }
        //说明新旧fiber类型相同
        if(sameType){
            newFiber = {
                tag : oldFiber.tag,
                type : oldFiber.type,
                props : newChild.props,
                stateNode : oldFiber.stateNode,
                return : currentFiber,
                alternate : oldFiber,
                effectTag:UPDATE,
                nextEffect:null
            }
        } else {
            //新虚拟DOM是不是null
            if(newChild){
                //newChild是虚拟DOM
                newFiber = {
                    tag,
                    type: newChild.type,//div
                    props: newChild.props, //[element]
                    stateNode: null, //div还没有创建dom元素
                    return: currentFiber,
                    effectTag: PLACEMENT,//类型收集副作用，dom操作
                    nextEffect: null, //effectList是一个单链表,顺序和完成的顺序是一样的，节点可能会少

                }
            }
            if(oldFiber){
                oldFiber.effectTag = DELETION;
                deletions.push(oldFiber);
            }

        }

        if (newFiber) {
            if (newChildIndex === 0) {
                currentFiber.child = newFiber;
            } else {
                prevSibling.sibling = newFiber;
            }
        }
        //往后移动
        if(oldFiber){
            oldFiber = oldFiber.sibling;
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
    if (!nextUnitOfWork && workInProgressRoot) {
        commitRoot();
        console.log('render结束')
    }
    requestIdleCallback(workLoop, { timeout: 500 })
}

function commitRoot() {
    //先删除，再更新或创建
    deletions.forEach(commitWork);
    //C1
    // debugger
    let currentFiber = workInProgressRoot.firstEffect;
    while (currentFiber) {
        commitWork(currentFiber);
        currentFiber = currentFiber.nextEffect;
    }
    deletions.length = 0;
    currentRoot = workInProgressRoot;
    workInProgressRoot = null;
}

function commitWork(currentFiber) {
    if (!currentFiber) {
        return;
    }
    let returnFiber = currentFiber.return;
    //父亲DOM，父亲fiber
    let returnDOM = returnFiber.stateNode;
    if (currentFiber.effectTag === PLACEMENT) {//处理了添加i
        returnDOM.appendChild(currentFiber.stateNode);
    } else if (currentFiber.effectTag === DELETION) {
        returnDOM.removeChild(currentFiber.stateNode);
    } else if (currentFiber.effectTag === UPDATE) {
        //文本节点
        if (currentFiber.type === ELEMENT_TEXT) {
            if (currentFiber.alternate && currentFiber.alternate.props.text == currentFiber.props.text) {
                return;
            }
            currentFiber.stateNode.textContent = currentFiber.props.text;
        } else {//更新元素
            updateDOM(currentFiber.stateNode, currentFiber.alternate.props, currentFiber.props);
        }
    }
    currentFiber.effectTag = null;
}

requestIdleCallback(workLoop, { timeout: 500 });
