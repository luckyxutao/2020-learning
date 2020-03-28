import React from 'react';
import ReactDOM from 'react-dom';
import routes from '../routes';
import {BrowserRouter} from 'react-router-dom';
ReactDOM.hydrate(<BrowserRouter>{routes}</BrowserRouter>, document.getElementById('root'));