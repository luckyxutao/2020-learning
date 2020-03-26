let isFirstRender = false;
let HostRoot = 'HostRoot';
let ClassComponent = 'ClassComponent';
let hostComponent = 'HostComponent'
let HostText = 'HostText';
let FunctionComponent = 'FunctionComponent';
let NoWork = 'NoWork';
let Placement = 'Placement'; //表示是新插入的节点
let Update = 'Update'; //表示当前节点有更新
let Deletion = 'Deletion' //表示当前节点要被删除
let PlacementAndUpdate = 'PlacementAndUpdate';//移动并更新了属性内容等
class FiberNode{
    constructor(tag,key,pendingProps){
        this.tag = tag //标识当前fiber的类型 
        this.key = key; 
        this.type = null;// div || function Ding
        this.stateNode = null //当前fiber的实例， new Ding后的实例
        this.child = null; //当前fiber的子节点，单数， firstchild
        this.sibling = null; //当前节点的兄弟节点
        this.return = null;
        this.index = 0;
        this.memoizedState = null; //当前fiber的state
        this.memoizedProps = null; // fiber的props
        this.pendingProps = pendingProps;
        this.effectTag = null; //表示当前节点要进行何种更新
        this.firstEffect = null; //表示当前节点的有更新的第一个子节点
        this.lastEffect= null ; ///表示当前节点的有更新的最后一个子节点
        this.nextEffect = null; //表示下一个要更新的子节点

        this.alternate = null; //用来链接
        this.updateQueue = null; //一条链表上面挂载的是当前fiber的新状态 [state111,state8888]

    }
}
function createFiber(){
    return new FiberNode();
}
function createWorkInProgress(current,pendingProps){
    let workInProgress = current.alternate;//复用current.alternate
    if(!workInProgress){
        workInProgress = createFiber(current.tag,pendingProps,current.key);
        workInProgress.type = current.type;
        workInProgress.stateNode = current.stateNode;
        workInProgress.alternate = current;
        current.alternate = workInProgress;
    } else {
        workInProgress.pendingProps = pendingProps;
        workInProgress.effectTag = NoWork;
        workInProgress.firstEffect = null;
        workInProgress.lastEffect = null;
        workInProgress.nextEffect = null;
    }
    //保证 current和current.alternate的updatequeue是同步的
    workInProgress.updateQueue = current.updateQueue;
    workInProgress.child = current.child;
    workInProgress.memoizedProps = current.memoizedProps;
    workInProgress.memoizedState  = current.memoizedState;
    workInProgress.sibling = current.sibling;
    workInProgress.index = current.index;
    return workInProgress;
}
class ReactRoot{
    constructor(container){
        this._internalRoot = this._createRoot(container);
    }
    _createRoot(container){
        let uninitialFiber = this._createUninitialFiber(HostRoot,null,null);
        let root = {
            container,
            current: uninitialFiber,
            finishedWork:null
        };
        uninitialFiber.stateNode = root;
        return root;
    }
    _createUninitialFiber(tag,key,pendingProps){
        return createFiber(tag,key,pendingProps);
    }
    render(reactElement,callback){
        let root = this._internalRoot;
        let workInProgress = createWorkInProgress(root.current,null,);
    }
}
const ReactDOM = {
    render(reactElement,container,callback){
        isFirstRender = true;
        let root = new ReactRoot(container)
        container._reactRootContainer = root;

        isFirstRender = false;
    }
}
export default ReactDOM