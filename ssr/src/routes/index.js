import React, { Fragment } from 'react';
import App from '../containers/App';
import Search from '../containers/Search';
import { Route } from 'react-router-dom';
import Main from '../containers/Main';
export default [{
    path:'/',
    // exact: true,
    component:Main,
    routes: [{
        path: "/app",
        component: App,
        key:'app',
        getInitialProps: App.getInitialProps
    }, {
        path: "/search",
        key:'search',
        component: Search,
        getInitialProps: Search.getInitialProps
    }]
}];