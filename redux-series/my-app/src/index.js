import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from './redux'
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

function search(state={},action){
  switch(action.type){
    case 'show':
      return {
        ...state,
        show : true
      };
    case 'hide':
      return {
        ...state,
        show : false
      };
    default:
      return state;
  }
}

const reducer = combineReducers({
  search,
  counter
});

let store = createStore(reducer);

const unscribe = store.subscribe(() => console.log(store.getState()))

// // The only way to mutate the internal state is to dispatch an action.
// // The actions can be serialized, logged or stored and later replayed.
store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'show' })
// 1