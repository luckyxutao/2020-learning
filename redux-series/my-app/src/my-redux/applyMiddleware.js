import compose from "./compose";

export default function applyMiddleware(...middlewares) {
    return function (createStore) {
        return function (reducer, initialState) {
            const store = createStore(reducer, initialState);
            let dispatch = store.dispatch;
            let chain = [];
            const middlewareAPI = {
                getState: store.getState,
                dispatch: (action) => { //对原有dispatch进行了封装
                    return dispatch(action);
                }
            };
            chain = middlewares.map(fn => fn(middlewareAPI));
            dispatch = compose(...chain)(dispatch);
            return {
                ...store,
                dispatch
            }
        }
    }
}