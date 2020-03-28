import React from 'react';
import ReactDOM from 'react-dom';
import routes from '../routes';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getClientStore } from '../store';
ReactDOM.hydrate(<Provider store={getClientStore()}>
    <BrowserRouter>
        {
            routes.map(route=>{
                return <Route key={route.path} {...route} />
            })
        }
    </BrowserRouter></Provider>, document.getElementById('root'));