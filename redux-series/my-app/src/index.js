import React from 'react';
import ReactDOM from 'react-dom';
// import { createStore, applyMiddleware } from 'redux';
// import { Provider } from 'react-redux';
import { createStore,applyMiddleware } from './my-redux'
import { Provider } from './my-react-redux';
import combinedReducers from './containers/reducers';
import './index.css';
import App from './containers/App';

function thunk(store) {
  return function (dispatch) {
    return function (action) {
      typeof action === 'function' ? action(dispatch, store) : dispatch(action)
    }
  }
}
function myLogger(store) {
  return function (dispatch) {
    return function (action) {
      console.log('before', action, store.getState().App)
      dispatch(action);
      console.log('after', action, store.getState().App)
    }
  }
}

const store = createStore(combinedReducers,applyMiddleware(thunk,myLogger));


ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);