import React from 'react';
import RouterContext from './context';
import matchPath from './matchPath';
export default class Route extends React.Component{
    static contextType = RouterContext;
    render(){
        const { location,history, match } = this.context;
        const { exact = false, component:Component, render, children, path='/' } = this.props;
        const match = matchPath(location.pathname,{ exact, path});
        let result = null;
        if(match){
            const props = {
                ...this.context,
                match
            };
            if(children){
                if(typeof children === 'function'){
                    result = children(props);
                } else {
                    result =  children;
                }
            } else if(Component){
                result = <Component {...props} />
            } else if(render){
                result = render(props);
            } else {
                return null;
            }
        } else if(children && typeof children === 'function'){
            result = children();
        } else {
            result = null;
        }
        return (
            <RouterContext.Provider value={props}>
                {result}
            </RouterContext.Provider>
        )
    }
}