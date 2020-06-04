
import { ELEMENT_TEXT } from './constant'
import UpdateQueue,{ Update } from './UpdateQueue';
import { scheduleRoot, useReducer, useState } from './schedule';

function createElement(type, config, ...children) {
    delete config.__self;
    delete config.__source;
    delete config.__owner;
    return {
        type,
        props: {
            ...config,
            children: children.map(child => {
                return typeof child === 'object' ? child : {
                    type: ELEMENT_TEXT,
                    props: {
                        text: child,
                        children: []
                    }
                }
            })
        }
    };
}
class Component{
    constructor(props){
        this.props = props;
        // this.updateQueue = new UpdateQueue();
    }
    setState(payload){
        //paload可能是对象也可能是函数
        let update = new Update(payload);
        // updateQueue其实是放在此类组件对应的fiber上的，_internalFiber
        this.internalFiber.updateQueue.enqueueUpdate(update);
        scheduleRoot();//从根节点开始
    }
}
Component.prototype.isReactComponent = {};

export default {
    createElement,
    Component,
    // useReducer,
    // useState
}