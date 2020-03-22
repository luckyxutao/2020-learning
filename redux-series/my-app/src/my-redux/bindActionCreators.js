
export default function bindActionCreators(actionCreators,dispatch){
    const boundActionCreators = {};
    for(let key in actionCreators){
        if(actionCreators.hasOwnProperty(key)){
            boundActionCreators[key] = bindActionCreator(actionCreators[key],dispatch);
        }
    }
    return boundActionCreators;
}

function bindActionCreator(actionCreator,dispatch){
    return function(){
        return dispatch(actionCreator.apply(this,arguments))
    }
}