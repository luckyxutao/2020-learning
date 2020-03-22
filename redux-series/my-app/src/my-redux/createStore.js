export default function createStore(reducer,initialState,enhancer){
    if(typeof initialState === 'function' && enhancer === undefined){
        enhancer = initialState
        initialState = undefined
    }
    if(typeof enhancer === 'function'){
        return enhancer(createStore)(reducer,initialState);
    }

    var currentReducer = reducer
    var currentState = initialState
    var currentListeners = []
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
        if(isDispatching){
            return;
        }
        try{
            isDispatching = true;
            currentState = currentReducer(currentState,action);
        } finally{
            isDispatching= false;
        }
        currentListeners.forEach(fn=>fn());
    }
    dispatch({
        type : '@action_init'
    });
    return {
        getState,
        subscribe,
        dispatch
    };
}