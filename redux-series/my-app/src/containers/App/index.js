import React from 'react';
import './index.css';
// import {connect} from 'react-redux';
// import { bindActionCreators } from 'redux';
import {connect} from '../../my-react-redux';
import * as actions from './action';
import { bindActionCreators } from '../../my-redux';

class App extends React.Component{
  onIncrementClick=()=>{
    this.props.increment();
  }
  onDecrementClick=()=>{
    this.props.decrement();
  }
  render(){
    return (
      <div className="App">
        <div>counter:{this.props.App && this.props.App.counter}</div>
        <div className="button" onClick={this.onIncrementClick}>increment</div>
        <div className="button" onClick={this.onDecrementClick}>decrement</div>
      </div>
    );
  }
}

function mapStateProps(state){
  return {
    App : state.App
  };
}
function mapDispatchToProps(dispatch){
   return bindActionCreators(actions,dispatch)
}
export default connect(mapStateProps,mapDispatchToProps)(App);
