import { TAG_ROOT } from './constant';
import { scheduleRoot } from './schedule';
function render(element, container) {
    let rootFiber = {
        tag: TAG_ROOT,
        //一般情况下如果这个元素是一个原生节点的话，stateNode指向真实DOM, 
        //如果
        stateNode: container,
        props: {
            //这个fiber属性对象children属性里放的是要渲染的元素(vdom)
            //是一个元素
            children: [element]
        }
    };
    scheduleRoot(rootFiber);

}

const ReactDOM = {
    render
};
export default ReactDOM;