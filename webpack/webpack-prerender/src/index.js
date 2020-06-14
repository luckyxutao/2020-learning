import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom';
let  Home = props=><div>Home</div>
let User = props=><div>User</div>
let Profile = props=><div>Profile</div>
ReactDOM.render(
    <Router>
        <>
          <Link to="/">home</Link>
          <Link to="/user">user</Link>
          <Link to="/profile">profile</Link>
          <Route path="/" exact={true} component={Home} />
          <Route path="/user" component={User} />
          <Route path="/profile" component={Profile}/>
        </>
    </Router>
,document.getElementById('root'));