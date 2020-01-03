import React from "react";
import Context from "./context";
export default class Router extends React.Component {
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
        this.unlisten = this.props.history.listen(location => {
            this.setState({ location });
          });
    }
    componentWillUnmount() {
        this.unlisten&& this.unlisten();
    }
    render(){
        const props = {
            history:this.props.history,
            location:this.state.location,
            match: Router.computeRootMatch(this.state.location.pathname),
        }
        return (
            <Context.Provider value={props}>
                {this.props.children}
            </Context.Provider>
        )
    }    
}