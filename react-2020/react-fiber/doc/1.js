class Update {
    constructor(payload){
        this.payload = payload;
        this.next = null;
    }
}


class UpdateQueue {
    constructor(){
        this.baseState = null; //原状态
        this.firstUpdate = null;//第一个更新
        this.lastUpdate = null; //最后一个更新
    }
    enqueueUpdate(update){
        if(!this.firstUpdate){
            this.firstUpdate = this.lastUpdate = update;
        } else {
            this. lastUpdate.next = update;
            this.lastUpdate = update;
        }

    }
    forceUpdate(){
        let currentState = this.baseState;
        let newUpd;
        let currentUpdate = this.firstUpdate;
        while(currentUpdate){
            newUpd = typeof currentUpdate.payload === 'function' ? currentUpdate.payload(currentState) : currentUpdate.payload;
            currentState = {...currentState,...newUpd};
            currentUpdate = currentUpdate.next;
        }
        this.firstUpdate = this.lastUpdate = null;
        this.baseState = currentState;
        return currentState;
    }
}

let queue = new UpdateQueue();
queue.enqueueUpdate(new Update({name:'xutao'}));
queue.enqueueUpdate(new Update({number:0}));
queue.enqueueUpdate(new Update(state=>({number:state.number+1})));
const re = queue.forceUpdate();
console.log(re)
