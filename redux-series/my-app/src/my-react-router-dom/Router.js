import React from 'react';

import Context from './context';
export default class Router extends React.Component{
    static computeRootMatch(pathname) {
        return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
    }
    constructor(props) {
        super(props);
        this.state = {
          location: props.history.location
        };
    }
    componentDidMount(){
        this.unsubscribe = this.props.history.listen((location,action)=>{
            this.setState({location});
        });
    }
    componentWillUnmount(){
        this.unsubscribe && this.unsubscribe();
    }
    render(){
        const props = {
            location : this.state.location,
            history : this.props.history,
            match: Router.computeRootMatch(this.state.location.pathname),
        }
        return  (
            <Context.Provider value={props}>
                {this.props.children}
            </Context.Provider>
        )   
    }
}