import React, {  useReducer } from "react";

const initState = {
    count : 0
};

function reducer(state,action){
    switch (action.type) {
        case 'increment':
            return { count : state.count + action.payload}
        case 'decrement':
            return {
                count : state.count - action.payload
            };
        default:
            break;
    }
}

export default function App(){
    const [state,dispatch] = useReducer(reducer,initState);
    return (
        <>
        Count: {state.count}
        <button onClick={() => dispatch({ type: "increment", payload: 5 })}>
          +
        </button>
        <button onClick={() => dispatch({ type: "decrement", payload: 5 })}>
          -
        </button>
      </>
    );
}