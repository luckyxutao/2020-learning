
export function bindActionCreators(actionCreators,dispatch){
    const boundActionCreators = {};
    for(let key in actionCreators){
        boundActionCreators[key] = bindActionCreator(actionCreators[i],dispatch));
    }
    return boundActionCreators;
}

function bindActionCreator(actionCreator,dispatch){
    return function(){
        return dispatch(actionCreator.apply(this,arguments))
    }
}

// export function increment(){
//     return {
//         type : 'INCREMENT'
//     };
// }

// export function decrement(){
//     return {
//         type : 'DECEREMENT'
//     }
// }