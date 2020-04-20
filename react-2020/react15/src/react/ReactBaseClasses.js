import { isFunction } from "./util";
import { compareTwoElements} from './vdom';
const emptyObject = {};

const updateQueue = {
    updaters:[],
    isPending:false,
    add(updater){
        this.updaters.push(updater);
    },
    batchUpdate(){
        if(this.isPending){
            return;
        }
        this.isPending = true;
        let { updaters} = this;
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
        if(!updateQueue.isPending){
            this.updateComponent();
        } else {
            updateQueue.add(this);
        }
    }
    updateComponent(){
        let { inst, pendingStates, nextProps} = this;
        if(nextProps || pendingStates.length > 0){
            this.shouldUpdate(
                inst,
                nextProps,
                this.getState()
            )
        }
    }
    shouldUpdate(inst,nextProps,nextState){
        inst .props = nextProps;
        inst.state = nextState;
        if(inst.shoudComponentUpdate && !inst.shouldComponentUpdate()){
            return;
        }
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
        // this.context = context;
        // this.refs = emptyObject;
    }

    forceUpdate(){
        let { props, state, renderElement: oldRenderElement } = this;
        if(this.componentWillUpdate){
            this.componentWillUpdate(props,state);
        }
        let newRenderElement = this.render();
        let currentElement = compareTwoElements(oldRenderElement,newRenderElement);
        this.renderElement = currentElement;
    }

    setState(partialState){
        this.$updater.addState(partialState);
    }
}
Component.prototype.isReactComponent = {};

class PureComponent extends Component{

}
PureComponent.prototype.isPureComponent = true;

export{
    PureComponent,
    Component
};