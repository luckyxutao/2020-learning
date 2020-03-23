import React from 'react';
import ReactDOM from 'react-dom';
// import { createStore, applyMiddleware } from 'redux';
// import { Provider } from 'react-redux';
// import { HashRouter as Router,Route } from 'react-router-dom';
// import {  } from 'connected-react-router';
import {createHashHistory} from 'history';

import { Router, Route} from './my-react-router-dom';
import { createStore,applyMiddleware } from './my-redux'
import { Provider } from './my-react-redux';
import combinedReducers from './containers/reducers';
import './index.css';
import App from './containers/App';
import Search from './containers/Search';

const history = createHashHistory();



const store = createStore(combinedReducers,applyMiddleware(thunk,myLogger));
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <React.StrictMode>
          <Route exact path='/' component={App} />
          <Route path="/search" component={Search} />
      </React.StrictMode>
    </Router>
  </Provider>,
  document.getElementById('root')
);


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