import { isFunction } from "./util";
import { compareTwoElements} from './vdom';

export const updateQueue = {
    updaters:[],
    isPending:false,//是否批量更新模式 如果isPending=true 则处于批量更新模式
    add(updater){
        this.updaters.push(updater);
    },
    batchUpdate(){
        let { updaters} = this;
        this.isPending = true;
        let updater;
        while(updaters.length>0){
            updater = updaters.pop();
            updater.updateComponent();
        }
        this.isPending = false;
    }
}

class Updater{
    constructor(inst){
        this.inst = inst;
        this.pendingStates = [];
        this.nextProps = null;
    }

    addState(partialState){
        this.pendingStates.push(partialState);
        this.emitUpdate();
    }
    emitUpdate(nextProps){
        this.nextProps = nextProps;
        //如果有新props或非批量更新模式
        if(nextProps || !updateQueue.isPending){
            this.updateComponent();
        } else {
            updateQueue.add(this);
        }
    }
    updateComponent(){
        let { inst, pendingStates, nextProps} = this;
        if(nextProps || pendingStates.length > 0){//如果有props或更新队列
            this.shouldUpdate(
                inst,
                nextProps,
                this.getState()
            )
        }
    }
    shouldUpdate(inst,nextProps,nextState){
        let shouldUpdate = true;
        if(inst.shouldComponentUpdate){
            shouldUpdate = inst.shouldComponentUpdate(nextProps,nextState);
        }
        if(shouldUpdate){
            this._performComponentUpdate(inst,nextProps,nextState);
        } else {
            inst.props = nextProps;
            inst.state = nextState;
        }
    }
    _performComponentUpdate(inst,nextProps,nextState){
        if(inst && inst.componentWillUpdate){
            inst.componentWillUpdate(nextProps,nextState);
        }
        inst.props = nextProps;
        inst.state = nextState;
        inst.forceUpdate();
    }
    getState(){
        let { inst,pendingStates} = this;
        let { state} = inst;
        //如果有挂起的state,合并state
        if(pendingStates.length>0){
            pendingStates.forEach(nextState=>{
                if(isFunction(nextState)){
                    nextState = nextState.call(inst,state);
                } 
                state = {...state,...nextState};
            });
            pendingStates.length = 0;
        }
        return state;
    }

}

class Component{
    constructor(props,context){
        this.props = props;
        this.$updater = new Updater(this);
        this.state = {};
        this.nextProps = null;
    }

    forceUpdate(){
        let { props, state, renderElement: oldRenderElement } = this;
        let newRenderElement = this.render();
        let currentElement = compareTwoElements(oldRenderElement,newRenderElement);
        this.renderElement = currentElement;
        if(this.componentDidUpdate){
            this.componentDidUpdate(props,state);
        }
    }

    setState(partialState){
        this.$updater.addState(partialState);
    }
}
Component.prototype.isReactComponent = {};
export{
    Component
};