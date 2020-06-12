class TimeScheduler {
    constructor() {
        this.events = [];
        this.orderCallStack = [];
        this.ownCallStack = [];
        this.timers = [];
    }
    //orderExec是任务异步方式 false是固定间隔，true是顺序
    add(fn = () => { }, orderExec = false, timeout = 3) {
        let fnc;
        if (orderExec) {
            fnc = () => {
                let timerId = setTimeout(() => {
                    fn();
                    this.next();
                }, timeout * 1000);
                this.timers.push({
                    orderExec,
                    timerId
                });
            };
        } else {
            fnc = () => {
                let timerId = setInterval(() => {
                    fn()
                }, timeout * 1000);
                this.timers.push({
                    orderExec,
                    timerId
                });
            };
        }
        this.events.unshift({
            fnc,
            orderExec
        })
    }
    remove(fnc = () => { }) {
        this.events = this.events.filter(item => item.fnc === fnc);
    }
    clear() { //清除存储数据及清空调用栈
        this.events = [];
        this.ownCallStack = [];
        this.orderCallStack = [];
        for(const {timerId,orderExec} of this.timers){
            if(orderExec){
                clearTimeout(timerId);
            } else {
                clearInterval(timerId);
            }
        }
    }
    start() { //开始执行
        this.orderCallStack = this.events.filter(item => !!item.orderExec);
        this.ownCallStack = this.events.filter(item => !item.orderExec);
        this.ownCallStack.forEach(item => item.fnc());
        this.next();
    }
    stop() { //停止执行
        for(const {timerId,orderExec} of this.timers){
            if(orderExec){
                clearTimeout(timerId);
            } else {
                clearInterval(timerId);
            }
        }
        this.ownCallStack = [];
        this.orderCallStack = [];
    }
    next() { //循环队列，死循环，取出一个任务执行之后，再放到队列尾部
        let obj = this.orderCallStack.pop() || {};
        if (obj.fnc) {
            this.orderCallStack.unshift(obj);
            obj.fnc();
        }
    }
}

let a = () => {
    console.log("a");
}
let b = () => {
    console.log("b");
}
let c = () => {
    console.log("c");
}
const timeScheduler1 = new TimeScheduler();
timeScheduler1.add(a, true, 3);
timeScheduler1.add(b, true, 3);
timeScheduler1.add(c, false, 1);
timeScheduler1.start();

setTimeout(()=>{
    timeScheduler1.stop();
},10000)