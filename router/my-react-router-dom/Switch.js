import React from "react";
import matchPath from "./matchPath";
import RouterContext from "./context";
class Switch extends React.Component {
    static contextType = RouterContext;
    render(){
        const {location} = this.context;
        let element = null, match;
        React.Children.forEach(this.props.children,child=>{
           if(match == null){
                element = child;
                const path = child.props.path || child.props.from;
                if(path){ //如果有path路径，则路径匹配，
                    match = matchPath(location.pathname,{...child.props,path});
                } else {// 没有path属性，则默认匹配所有 /
                    match = this.context.match;
                }
           } 
        });
        return element;
    }
}

export default Switch;

