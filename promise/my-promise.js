
function Promise(executor){
    let self = this;
    self.status = 'pending';
    self.value = undefined;
    self.onResolvedCallbacks = [];
    self.onRejectedCallbacks = [];
    function resolve(value){
        setTimeout(() => {
            if(self.status === 'pending'){
                self.value = value;
                self.status = 'resolved';
                self.onResolvedCallbacks.forEach(fn=>fn(value));
            }
        }, 0);
    }
    function reject(value){ 
        setTimeout(() => {
            if(self.status === 'pending'){
                self.value = value;
                self.status = 'rejected';
                self.onRejectedCallbacks.forEach(fn=>fn(value));
            }
        }, 0);
    }

    try {
        executor(resolve,reject);
    } catch (error) {
        reject(error);
    }
}

function resolvePromise(promise2,x,outerResolve,outerReject){
    if(x=== promise2){
        return outerReject(new TypeError('循环引用'));
    }
    let then,called;
    if(x!=null && (typeof x === 'object' || typeof x === 'function')){
        try {
            then = x.then;
            if(typeof then === 'function'){//如果是then里返了新promise，则用那个then的onfull,onreject来决定下一个
                then.call(x,y=>{
                    if(called){
                        return;
                    }
                    called = true;
                    resolvePromise(promise2,y,outerResolve,outerReject);
                },r=>{
                    if(called){
                        return;
                    }
                    called = true;
                    outerReject(r);
                })
            } else {
                outerResolve(x);
            }
        } catch (e) {
            if(called){
                return;
            }
            called = true;
            outerReject(e);
        }
    } else {
        outerResolve(x);
    }
}

Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
}
Promise.prototype.then = function(onFulfilled,onRejected){
    let self = this;
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value)=>value;
    onRejected = typeof onRejected === 'function' ? onRejected : (err)=>{throw err}
    let promise2;
    if(this.status === 'pending'){
        promise2 = new Promise((resolve,reject)=>{
            self.onResolvedCallbacks.push(function(value){
                try {
                    let x = onFulfilled(value);
                    resolvePromise(promise2,x,resolve,reject);
                } catch (e) {
                    reject(e);
                }
            });
            self.onRejectedCallbacks.push(function(value){
                try {
                    let x = onRejected(value);
                    resolvePromise(promise2,x,resolve,reject);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
    if(self.status === 'resolved'){
        promise2 = new Promise((resolve,reject)=>{
            setTimeout(() => {
                try {
                    let x = onFulfilled(this.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (error) {
                    reject(error);
                }
            }, 0);
        });
    }
    if(self.status === 'rejected'){
        promise2 = new Promise((resolve,reject)=>{
            setTimeout(() => {
                try {
                    let x = onRejected(this.value);
                    resolvePromise(promise2,x,resolve,reject)
                } catch (error) {
                    reject(error);
                }
            }, 0);
        });
    }
    return promise2;

}
Promise.deferred = Promise.defer = function () {
    var defer = {};
    defer.promise = new Promise(function (resolve, reject) {
      defer.resolve = resolve;
      defer.reject = reject;
    })
    return defer;
}

Promise.race = function(arr){
    return new Promise((resolve,reject)=>{
        for(let i=0;i<len;i++){
            arr[i].then(res=>{
                resolve(res);
            },err=>{
                reject(err);
            })
        }
    });
}

Promise.all = function(arr){
    let len = arr.length;
    let results = [];
    return new Promise((resolve,reject)=>{
        for(let i=0;i<len;i++){
            arr[i].then(res=>{
                results[i] = res;
                if(results.length === len){
                    resolve(results);
                }
            },err=>{
                reject(err);
            })
        }
    });

}

module.exports = Promise;