import React,{Fragment} from 'react';
import Counter from '../containers/Counter';
import Home from '../containers/Home';
import { Route } from 'react-router-dom';
export default (
    <Fragment>
        <Route path="/home" component={Home}></Route>
        <Route path="/counter" component={Counter}></Route>
    </Fragment>
)