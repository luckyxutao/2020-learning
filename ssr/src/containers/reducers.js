import { combineReducers } from 'redux';
import App from './App/reducer';
import Search from './Search/reducer';

export default combineReducers({
    App,
    Search
});