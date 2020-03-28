import React from 'react';
import ReactDOM from 'react-dom';
import routes from '../routes';
import { BrowserRouter, Route } from 'react-router-dom';
import {renderRoutes,matchRoutes} from 'react-router-config'
import { Provider } from 'react-redux';
import { getClientStore } from '../store';
ReactDOM.hydrate(<Provider store={getClientStore()}>
    <BrowserRouter>
        {renderRoutes(routes)}
    </BrowserRouter></Provider>, document.getElementById('root'));