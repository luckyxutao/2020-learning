
import React from 'react';
import context from './context';
export default function connect(mapStateProps,mapDispatchProps){
    return function(WrappedComponent){
        return class extends React.Component{
            static contextType = context;
            state = {}
            componentDidMount(){
                const store = this.context;
                this.unsubscribe = store.subscribe(()=>{
                    const newState = mapStateProps(store.getState());
                    this.setState(newState);
                });
            }
            componentWillUnmount(){
                this.unsubscribe();
            }
            render(){
                const store = this.context;
                const dispatchs = mapDispatchProps(store.dispatch)
                return <WrappedComponent {...dispatchs} {...this.props} {...this.state} />
            }
        }
    }
}