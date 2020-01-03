import React from "react";
import context from "./context";

export default class Link extends React.Component {
  static contextType = context;
  render() {
    const { history} = this.context;
    const { to, push=true, ...rest} = this.props;
    const method = push ? history.push : history.replace;
    return <a {...rest} onClick={(e)=>{
        e.preventDefault();
        method(to);
    }}>{this.props.children}</a>
  }
}