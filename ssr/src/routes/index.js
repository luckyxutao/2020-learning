import React, { Fragment } from 'react';
import App from '../containers/App';
import Search from '../containers/Search';
import { Route } from 'react-router-dom';
export default [{
    path:"/home",
    exact:true,
    component: App,
    getInitialProps: App.getInitialProps
}, {
    path: "/search",
    component: Search,
    getInitialProps: Search.getInitialProps
}];
// export default (
//     <Fragment>
//         <Route path="/home" exact component={App}></Route>
//         <Route path="/search" component={Search}></Route>]
//     </Fragment>
// )