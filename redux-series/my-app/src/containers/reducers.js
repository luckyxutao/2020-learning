import {combineReducers} from '../my-redux';
import App from './App/reducer';
import Search from './App/reducer';

export default combineReducers({
    App,
    Search
});