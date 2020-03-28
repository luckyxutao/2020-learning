import actionTypes from './type';
import NetInterface from '../../services/NetInterface';
export function increment(){
    return function(dispatch){
        setTimeout(function(){
            return dispatch({
                type : actionTypes.INCREMENT
            })
        },2000)
    }
}

export function fetchBooks(query){
    return (dispatch)=>{
        return NetInterface.fetchBooks(query).then(res=>{
           dispatch({
               type : actionTypes.SAVE_LOCAL,
               data : res.data,
               query
           })
        });
    }
}

export function decrement(){
    return {
        type : actionTypes.DECREMENT
    };
}