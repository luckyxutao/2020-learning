
/**
 * 1. 事件是绑定到document上的，类似于事件委托
 * 2. 合成事件抹平了浏览器差异
 * 3. 合成事件实现了对象复用、重用，减少垃圾回收，提升性能
 * 4. 批量更新等也依赖合成事件setState等
 * @param {*} dom 
 * @param {*} eventType 
 * @param {*} listener 
 */
function addEvent(dom, eventType, listener) {
    eventType = eventType.toLowerCase();
    let eventStore = dom.eventStore || (dom.eventStore = {});
    eventStore[eventType] = listener;
    document.addEventListener(eventType.slice(2), dispatchEvent, false);
}
let syntheticEvent;
function dispatchEvent(event) {
    let { type, target } = event;
    let eventType = 'on' + type;
    //此处给syntheicEvent赋值
    syntheticEvent = getSyntheticEvent(event);
    while (target) {
        let { eventStore } = target;
        let listener = eventStore && eventStore[eventType];
        syntheticEvent.currentTarget = target;
        if (listener) {
            listener.call(target, syntheticEvent);
        }
        target = target.parentNode;
    }
    for(let key in syntheticEvent){
        syntheticEvent[key] = null;
    }
}
function persist(){
    syntheticEvent = { persist}
}

function getSyntheticEvent(nativeEvent){
    if(!syntheticEvent){
        syntheticEvent= {}
    }
    for (let key in nativeEvent) {
        if (typeof key === 'function') {
            syntheticEvent[key] = nativeEvent[key].bind(nativeEvent);
        } else {
            syntheticEvent[key] = nativeEvent[key];
        }
    }
    syntheticEvent.persist = persist;
    syntheticEvent.nativeEvent = nativeEvent;
    return syntheticEvent;
}
// function createSyntheticEvent(nativeEvent) {
//     let syntheticEvent = new SyntheticEvent(nativeEvent);
//     for (let key in nativeEvent) {
//         if (typeof key === 'function') {
//             syntheticEvent[key] = nativeEvent[key].bind(nativeEvent);
//         } else {
//             syntheticEvent[key] = nativeEvent[key];
//         }
//     }
//     syntheticEvent.nativeEvent = nativeEvent;
//     return syntheticEvent;
// }

export {
    addEvent
}