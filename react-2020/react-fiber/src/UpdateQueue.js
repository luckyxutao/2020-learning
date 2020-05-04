export class Update{
    constructor(payload){
        this.payload = payload;
        this.nextUpdate = null;
    }
}

export default class UpdateQueue {
    constructor(props){
        this.firstUpdate = null;
        this.lastUpdate = null;
    }
    enqueueUpdate(update){
        if(!this.firstUpdate){
            this.firstUpdate = update;
        } else {
            this.lastUpdate.nextUpdate = update;
        }
        this.lastUpdate = update;
    }
    forceUpdate(state){
        let currentUpdate = this.firstUpdate;
        while(currentUpdate){
            let nestState = typeof currentUpdate.payload === 'function' ? currentUpdate.payload(state) : currentUpdate.payload;
            state = {...state,...nestState};
            currentUpdate = currentUpdate.nextUpdate;
        }
        this.firstUpdate = this.lastUpdate = null;
        return state;
    }
}