import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router,Route } from 'react-router-dom';
import './index.css';
function AsyncComponent(loadComponent,placeholder='loading……'){
    return class AyncComponent extends React.Component{
        state = {
            Child:null
        }
        async componentDidMount(){
            loadComponent().then(res=>{
                this.setState({
                    Child:res.default
                })
            })
        }
        render(){
            const { Child } = this.state;
            return (
                Child ? <Child {...this.props} /> : placeholder
            );
        }
    }    
}

const App = ()=>{
    return (
        <Router>
            <Route path="/m1" component={AsyncComponent(()=>{
                return import('./pages/m1');
            })} />
            <Route path="/m2" component={AsyncComponent(()=>{
                return import('./pages/m2');
            })} />
        </Router>
    )
}
ReactDOM.render(<App />, document.getElementById('root'));