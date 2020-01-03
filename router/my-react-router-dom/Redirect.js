import React from "react";
import context from "./context";

export default class Redirect extends React.Component {
  static contextType = context;
  render() {
    const { history} = this.context;
    const { to, push = false } = this.props;
    const method = push ? history.push : history.replace;
    method(to);
    return null;
  }
}