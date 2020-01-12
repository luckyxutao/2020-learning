import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
import Login from './components/Login';
import User from './components/User';
const history = createHashHistory();
ReactDOM.render(
    <Router history={history}>
        <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/user" component={User} />
            <Redirect to="/" />
        </Switch>
    </Router>, document.querySelector('#root')
);