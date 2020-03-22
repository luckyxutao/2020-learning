
export default function (reducers) {
    const finalReducerKeys = Object.keys(reducers);
    return function (state, action) {
        const nextState = {};
        for (let i = 0; i < finalReducerKeys.length; i++) {
            const keyName = finalReducerKeys[i];
            const reducer = reducers[keyName];
            const oldState = state || {};
            const prevStateForKey = oldState[keyName];//取出reducer所对应的state
            const nextStateForKey = reducer(prevStateForKey, action); //只会把reducer所对应的state传入
            nextState[keyName] = nextStateForKey;
        }
        return nextState;
    }
}