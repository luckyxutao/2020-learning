class Emmiter {
    constructor() {
        this.listeners = {};
    }
    on(type, lisener) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(lisener);
    }
    emit(type){
        const subsibers = this.listeners[type];
        subsibers.forEach(fn=>fn())
    }
}
module.exports = Emmiter;