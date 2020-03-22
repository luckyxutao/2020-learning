import actionTypes from './type';
export function increment(){
    return function(dispatch){
        setTimeout(function(){
            return dispatch({
                type : actionTypes.INCREMENT
            })
        },2000)
    }
}

export function decrement(){
    return {
        type : actionTypes.DECREMENT
    };
}