

export function Update(payload){
    this.payload = payload;
}

export class UpdateQueue{
    constructor(){
        this.firstUpdate = null;
        this.lastUpdate = null;
    }
    enqueueUpdate(update){
        if(!this.firstUpdate){
            this.firstUpdate = update;
            this.lastUpdate = update;
        } else {
            this.lastUpdate.nextUpdate = update;
            this.lastUpdate = update;
        }
    }
    forceUpdate(state){
        let currentUpdate = this.firstUpdate;
        while(currentUpdate){
            let newState = typeof currentUpdate.payload === 'function' ? currentUpdate.payload(state) : currentUpdate.payload;
            state = {
                ...state,
                ...newState
            }
            currentUpdate = currentUpdate.nextUpdate;
        }
        this.firstUpdate = this.lastUpdate = null;
        return state;
    }
}