import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import logger from 'redux-logger';
import reducers from '../containers/reducers';
export function getClientStore(){
    return createStore(reducers, applyMiddleware(thunk, logger));
}

export function getServerStore(){
    return createStore(reducers, applyMiddleware(thunk));
}