import React, { useEffect, useReducer, useCallback } from "react";

import logo from './logo.svg';
import './App.css';
let initialState = {
  number: 0
};
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
function reducer(state, action) {
  switch (action.type) {
    case INCREMENT: {
      return { number: state.number + 1 };
    };
    case DECREMENT: {
      return { number: state.number - 1 };
    }
    default:
      return state;
  }
}
//叫自定义hooks
function useState(initialState) {
  const reducer = useCallback((state,action)=>action.payload);
  let [state, dispatch] = useReducer(reducer, initialState);
  function setState(payload) {
    dispatch({ payload });
  }
  return [state,setState];
}

function App() {
  let [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <div>You clicked count {state.number} times!</div>
      <button onClick={() => dispatch({
        type: INCREMENT
      })}>Click me for rendering!</button>
    </>
  );
}

export default App;
