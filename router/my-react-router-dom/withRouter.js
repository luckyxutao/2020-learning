import React from "react";
import context from "./context";
export default (WrappedComponent) => {
    return class extends React.Component{
        static contextType = context;
        render(){
            return <WrappedComponent {...this.props} {...this.context} />
        }
    }
};