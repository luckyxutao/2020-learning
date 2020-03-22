import actionTypes from './type';
export function increment(){
    return {
        type : actionTypes.INCREMENT
    };
}

export function decrement(){
    return {
        type : actionTypes.DECREMENT
    };
}