import React from "react";
import RouterContext from "./context";
import matchPath from "./matchPath";
export default class Route extends React.Component {
  static contextType = RouterContext;
  render() {
    const { location } = this.context;
    const {
      path='/',
      component: Component,
      exact = false,
      render,
      children
    } = this.props;
    const match = matchPath(location.pathname, {
      exact,path
    });
    const props = { ...this.context, match };
    let result = null;
    if(props.match){
      if(children){
        if(typeof children === 'function'){
          result=  children(props);
        } else {
          result = children;
        }
      } else if(Component){
        result = <Component {...props} />;
      } else if(render){
        result = render(props);
      } else {
        result = null;
      }
    } else if(typeof children === 'function'){
      result = children(props);
    } else {
      result = null;
    }
    return (
      <RouterContext.Provider value={props}>
      {
        result
      }
    </RouterContext.Provider>
    )
  }
}