
import React from 'react';
import Context from './context';
export default class Provider extends React.Component{
    render(){
        return (
            <Context.Provider value={this.props.store}>
                {this.props.children}
            </Context.Provider>
        )
    }
}