import { TAG_HOST, TAG_ROOT, ELEMENT_TEXT, TAG_TEXT,PLACEMENT, DELETION, UPDATE } from "./constant";
import {setProps} from './utils';
/**
 * 
 * 从根节点开始渲染和调试
 * 两个阶段
 * 1. diff   
 *   比较耗时，可以进行任务拆分
 * 2. 更新dom commit
 *   一气呵成
 */
let nextUnitOfWork = null;//下一个工作
// RootFiber应用的根
let workInProgressRoot = null;
//当前界面
let currentRoot = null;//渲染成功之后当前根rootfiber

let deletions = []; //删除的节点我们并不放在effect list里，所以需要单独记录执行 
export function scheduleRoot(rootFiber) {
    //第三次渲染了，currentRoot已经有alternamte
    if(currentRoot && currentRoot.alternate){
        //当前是第3次，使用上上次的currentRoot
        workInProgressRoot = currentRoot.alternate;
        // props更成新的
        workInProgressRoot.props = rootFiber.props;
        // alternate指向上一次(第2次)
        workInProgressRoot.alternate = currentRoot;
    } else if(currentRoot){//至少渲染过一次了
        //新的fiber alternate指向上一次的root
        rootFiber.alternate = currentRoot;
        workInProgressRoot = rootFiber;
    } else {
        workInProgressRoot = rootFiber;
    }
    workInProgressRoot.firstEffect = workInProgressRoot.lastEffect = workInProgressRoot.nextEffect = null;
    //{tag:TAG_ROOT, stateNode:container, props:children[element]}
    nextUnitOfWork = workInProgressRoot;
    // rootFiber = rootFiber;
}

function performUnitOfWork(currentFiber) {
    beginWork(currentFiber);
    if(currentFiber.child){
        return currentFiber.child;
    }
    while(currentFiber){
        //没有儿子的就完成了
        completeUnitOfWork(currentFiber);
        //如果有弟弟则返回弟弟
        if(currentFiber.sibling){
            return currentFiber.sibling;
        }
        //找父亲让许父亲完成
        currentFiber = currentFiber.return;
    }
}
    //每个fiber有两个属性，firstEffect指向第一个有副作用的子fiber,
    // last指向最后一个有副作用的子fiber
    //中间的用nextEffect做成一个单链表
    //firstEffect=大儿子.nextEffect=二儿子.nextEffect=三儿子.nextEffect <=lastEffect

function completeUnitOfWork(currentFiber){//第一个完成A1(Text)
    console.log('workDone',currentFiber)
    let returnfiber = currentFiber.return;//A1
    if(returnfiber){
        // // //如果爷爷没有first，把自己的儿子，链挂到父亲身上
        if(!returnfiber.firstEffect){
            returnfiber.firstEffect = currentFiber.firstEffect;
            returnfiber.lastEffect = currentFiber.lastEffect;
        }
        if(currentFiber.lastEffect){
            //还是链表插入节点逻辑
            if(returnfiber.lastEffect){//如果之前有
                returnfiber.lastEffect.nextEffect = currentFiber.firstEffect;
                returnfiber.lastEffect = currentFiber.lastEffect;
            }
            // 错在这个位置了
        }
        //////把自己挂到父亲，////
        const effectTag = currentFiber.effectTag;
        if(effectTag){//自己有副作用
            if(!returnfiber.firstEffect){
                returnfiber.firstEffect = currentFiber;
            } else if(returnfiber.lastEffect){
                returnfiber.lastEffect.nextEffect = currentFiber;
            }
            returnfiber.lastEffect = currentFiber;
        }
    }

}
/**
 * beginWork开始收下线钱
 * completeWork把下线的钱收完了+自己的钱
 * 1. 创建真实DOM
 * 2. 创建子fiber
 */
function beginWork(currentFiber) {
    if (currentFiber.tag === TAG_ROOT) {
        updateHostRoot(currentFiber);
    } else if(currentFiber.tag === TAG_TEXT){
        updateHostText(currentFiber);
    } else if(currentFiber.tag === TAG_HOST){
        updateHost(currentFiber);
    }
}
function createDOM(currentFiber){
    if(currentFiber.tag === TAG_TEXT){
        return document.createTextNode(currentFiber.props.text);
    } else if(currentFiber.tag === TAG_HOST){
        let stateNode = document.createElement(currentFiber.type);
        updateDOM(stateNode,{},currentFiber.props);
        return stateNode;
    }
}
function updateHost(currentFiber){
    if(!currentFiber.stateNode){
        currentFiber.stateNode = createDOM(currentFiber);
    }
    const newChildren = currentFiber.props.children;
    reconcileChildren(currentFiber,newChildren);
}
function updateDOM(stateNode,lastProps,nextProps) {
    setProps(stateNode,lastProps,nextProps);
}

function updateHostText(currentFiber){
    if(!currentFiber.stateNode){
        currentFiber.stateNode = createDOM(currentFiber);
    }
}

function updateHostRoot(currentFiber) {
    let newChildren = currentFiber.props.children;//[element]
    reconcileChildren(currentFiber, newChildren);

}
/**
 * 第一次 array->linkList
 * 第二次 newArr和linkList对比较
 * 第三次 newLinkList和oldLinkList比较
 */
function reconcileChildren(currentFiber, newChildren) {
    let newChildIndex = 0;//新子节点索引
    let prevSibling; //上一个新的子fiber

    //新fiber的children（array)和oldFiber.child->sibling链表对比

    //如果说当前fiber有alternamte属性，并县域alernate也有child
    let oldFiber = currentFiber.alternate && currentFiber.alternate.child;
    //遍历我们的子虚拟DOM元素数组，为每个虚拟DOM元素创建子fiber
    // 旧children长度可能大于新的，也可能小于新的
    while (newChildIndex < newChildren.length || oldFiber) {
        //取出当前索引对应的vdom
        let newChild = newChildren[newChildIndex];
        let newFiber; //新的fiber
        //新的元素和旧的fiber type是否一样
        const sameType = oldFiber && newChild && oldFiber.type === newChild.type
        
        let tag;
        if (newChild && newChild.type === ELEMENT_TEXT) {
            tag = TAG_TEXT; //文本节点，element='aaaa';
        } else if (newChild && typeof newChild.type === 'string') {
            tag = TAG_HOST;
        }
        //老的fiber和新的vdom类型一样，可以复用老vdom，更新即可
        if(sameType){
            newFiber = {
                tag : oldFiber.tag,// TAG_HOST
                type: oldFiber.type,//div,哪个都行（因为完全相同）
                props: newChild.props,
                stateNode: oldFiber.stateNode,//此时还没有创建DOM元素
                return:currentFiber,//父fiber returnfiber
                //新fiber的alternamte指向老的fiber节点
                alternate:oldFiber,
                effectTag:UPDATE,//副作用标识，render我们会收集副作用,增加\删除、MOVE
                nextEffect:null, //effectList也是一个单链表，是个指针
            }
        } else {
            /** 不能复用情况 **/
            //newElement可能是个null，不用创建fiber了
            if(newChild){
                newFiber = {
                    tag,// TAG_HOST
                    type: newChild.type,//div
                    props: newChild.props,
                    stateNode: null,//此时还没有创建DOM元素
                    return:currentFiber,//父fiber returnfiber
                    effectTag:PLACEMENT,//副作用标识，render我们会收集副作用,增加\删除、MOVE
                    nextEffect:null, //effectList也是一个单链表，是个指针
                    //effectlist顺序和完成顺序是一样的（可能会少，某些元素不需要  ），但是节点只放那些出钱的人的fiber节点，不出钱的人绕过去
                };
            }
            //删除不能利用元素
            if(oldFiber){
                oldFiber.effectTag = DELETION;
                deletions.push(oldFiber);
            }
        }
        //有可能新的节点少，oldFiber还要循环完
        if(oldFiber){
            oldFiber = oldFiber.sibling; //old也向后移动一次
        }
        //最小的儿子是没有弟弟的???
        if(newFiber){
            //如果当前索引为0，说明是太子
            if(newChildIndex === 0){
                currentFiber.child = newFiber;
            } else {
                prevSibling.sibling = newFiber;
            }
            prevSibling = newFiber;
        }
        newChildIndex++;
    }
}

//循环执行工作 nextUnitWork
function workLoop(deadline) {
    let shouldYield = false;//是否要让出时间片（控制权）
    while (!shouldYield && nextUnitOfWork) {
        // debugger
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        //没有时间让出控制权
        shouldYield = deadline.timeRemaining() < 1;
    }
    if (!nextUnitOfWork && workInProgressRoot) {
        console.log('render阶段结事');
        // debugger
        commitRoot();
    }
    requestIdleCallback(workLoop, { timeout: 500 });
}
function commitRoot(){
    //执行effectlist 之前先把该删除的元素删除
    deletions.forEach(commitWork);
    let currentFiber = workInProgressRoot.firstEffect;
    while(currentFiber){
        commitWork(currentFiber);
        // console.log(currentFiber)
        currentFiber = currentFiber.nextEffect;
    }
    deletions.length = 0;
    currentRoot = workInProgressRoot;
    workInProgressRoot = null;
}
function commitWork(currentFiber){
    if(!currentFiber){
        return;
    }
    let returnfiber = currentFiber.return;
    let returnDOM = returnfiber.stateNode;
    //添加
    if(currentFiber.effectTag === PLACEMENT){
        returnDOM.appendChild(currentFiber.stateNode);
    } else if( currentFiber.effectTag === DELETION){
        returnDOM.removeChild(currentFiber.stateNode)
    } else if( currentFiber.effectTag == UPDATE){
        if(currentFiber.type === ELEMENT_TEXT){
            if(currentFiber.alternate.props.text !== currentFiber.props.text){
                currentFiber.stateNode.textContent = currentFiber.props.text;
            }
        } else {
            updateDOM(currentFiber.stateNode,currentFiber.alternate.props,currentFiber.props);
        }
    }
    //清掉
    currentFiber.effectTag = null;
}
// 告诉浏览器 有空闲时 帮我执行任务
requestIdleCallback(workLoop, { timeout: 500 })


