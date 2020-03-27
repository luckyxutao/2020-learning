export default function compose(...funcs) {
    if (funcs.length === 1) {
        return funcs[0]
    }
    return funcs.reduce((a, b) => {
        return (...args) => {
            return a(b(...args))
        }
    });
}

function myLogger(dispatch) {
    return function (action) {
        console.log(action + 'before_logger')
        dispatch(action);
        console.log(action + 'after_logger')
    }
}
function thunk(dispatch) {
    return function (action) {
        console.log(action + 'before_thunk')
        dispatch(action)
        console.log(action + 'after_thunk')
    }
}
function dispatch(action) {
    console.log('origin', action)
}



var re = compose(thunk, myLogger)(dispatch);
re('aaaaaa')
