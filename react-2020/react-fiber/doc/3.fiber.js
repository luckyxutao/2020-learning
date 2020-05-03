let A1 = {
    type: 'div',
    key: 'A1'
};
let B1 = {
    type: 'div',
    key: 'B1',
    return: A1
};
let B2 = {
    type: 'div',
    key: 'B2',
    return: A1
};
let X2 = {
    type: 'div',
    key: 'X2',
    return: B2
};
let C1 = {
    type: 'div',
    key: 'C1',
    return: B1
};
let C2 = {
    type: 'div',
    key: 'C2',
    return: B1
};
A1.child = B1;
B1.sibling = B2;
B1.child = C1;
C1.sibling = C2;
B2.child = X2;
const rootFiber = A1;

let nextUnitOfWork = null;
// let star = Date.now();
function workLoop(deadline) {
    //didTimeout表示是否任务已超时，如果超时则立即执行，不等空闲时机了
    // console.log(deadline.didTimeout)
    // while ((deadline.timeRemaining()>1 || deadline.didTimeout) && nextUnitOfWork) {
    while (nextUnitOfWork) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    if (!nextUnitOfWork) {
        // console.log(Date.now() -star)
        console.log('render阶段结束')
    } else {
        requestIdleCallback(workLoop, { timeout: 1000 })
    }
}
function performUnitOfWork(fiber) {
    beginWork(fiber);//处理
    if (fiber.child) {
        return fiber.child;
    }
    while (fiber) {
        completeUnitOfWork(fiber);
        if (fiber.sibling) {
            return fiber.siblingW
        }
        fiber = fiber.return;
    }

    // while(fiber){

    //     if(fiber.sibling){
    //         return fiber.sibling;
    //     }
    //     completeUnitOfWork(fiber);
    //     fiber = fiber.return
    // }
    // completeUnitOfWork(fiber);
    // if (fiber.sibling) {
    //     return fiber.sibling;
    // }

    // fiber = fiber.return;
    // completeUnitOfWork(fiber);
    // if (fiber.sibling) {
    //     return fiber.sibling;
    // }

}
function completeUnitOfWork(fiber) {
    console.log('结束', fiber.key)
}
function beginWork(fiber) {
    console.log('开始', fiber.key);
    // sleep(20);
}
nextUnitOfWork = rootFiber;
// requestIdleCallback(workLoop,{timeout:1000})
workLoop();

function sleep(d) {
    let start = Date.now();
    while (Date.now() - start <= d) {

    }
}

// function performUnitOfWork(fiber) {
//     beginWork(fiber);//处理
//     if (fiber.child) {
//         return fiber.child;
//     }
//     completeUnitOfWork(fiber);
//     while(fiber){
//         if(fiber.sibling){
//             return fiber.sibling;
//         }
//         fiber = fiber.return;
//         completeUnitOfWork(fiber);
//         if(fiber.sibling){
//             return fiber.sibling;
//         }
//         return;
//     }

// }