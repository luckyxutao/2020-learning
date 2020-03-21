export default function createStore(reducer,initialState){
    var currentReducer = reducer
    var currentState = initialState
    var currentListeners = []
    var nextListeners = currentListeners
    var isDispatching = false;

    function getState() {
        return currentState;
    }

    function subscribe(listener){
        var isSubscribed = true
        currentListeners.push(listener);
        return function (){
            if (!isSubscribed) {
                return
            }
            isSubscribed = false
            let index = currentListeners.indexOf(listener);
            currentListeners.splice(index,1);
        }
    }

    /**
     * {
     *   type : 'xxxxx'
     * }
     * @param {*} action 
     */
    function dispatch(action){
        currentState = currentReducer(currentState,action);
        currentListeners.forEach(fn=>fn());
    }

    return {
        getState,
        subscribe,
        dispatch
    };
}