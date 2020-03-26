###
react 应用 从始至终  管理着最基本的三样东西
// 1. Root(整个应用的根，一个对象，不是fiber，有个属性指向current树，同样也有个属性指向workInProgress树)  
// 2. current树(树的每个节点都是filber,并且每个fiber节点都对应着一个jsx节点) //上一次状态，
// 3. workInProgress树(树上的每个节点都是fiber，并且每个fiber节点都对应一个jsx节点) // 即将变的 新状态

// 初次渲染的时候，没有current树
// react在一开始创建Root 就会同时创建一个 unInitialFiber的东西（未初始化的fiber)
// 让react current 指向了uninitialFiber
// 之后再去创建一个本次要用到的workInProgress

//主要两个阶段
// 1. render(创建fiber的过程)
1. 为每个节点创建新的fiber(workInProgress)(可能是复用)，生成一颗有新状态的workInProgress树
2. 初次渲染的时候（或新创建了某个节点的时候）会将这个fiber创建真实的dom实例 并且对当前节点的子节点进行插入
3. 如果不是初次渲染的话，就对比新旧的fiber的状态，将产生了更新的fiber节点，最终通过链表的形式 挂载到RootFiber

// 不管是初次渲染还是setState都 是从root开始遍历的

// 2. commit(真正操作页面阶段)
* 执行生命周期
* 从RootFiber上获取到那条链表，根据链表上的标识 来操作页面

//setState更新是同步还是异步
没使用Concurrent组件的情况下，是同步的
但是不会 立即获取到最新的state值，因为调用setState只是单纯地将你进来新的state放入到updateQueue这条链表上

当使用了Concurrent组件的时候  才是真正的异步
同样没法立即获取最新状态，并且在执行react的更新和渲染的过程中 使用了真正的异步方式

// flushSync 会立即触发更新state及渲染过程
