import React from 'react';
import ReactDOM from 'react-dom';
// import { createStore, combineReducers } from './redux'
import { createStore } from 'redux';
import {Provider} from 'react-redux';
import combinedReducers from './containers/reducers';
import './index.css';
import App from './containers/App';

const store = createStore(combinedReducers);


ReactDOM.render(
  <Provider store = {store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);