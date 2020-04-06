
let emptyObject={};
class Component{
    constructor(props,context){
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
    }
}
//都会编译成function,区分函数式组件还是class组件
Component.prototype.isReactComponent = {};
export {Component}