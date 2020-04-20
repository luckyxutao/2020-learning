import React, { Component } from './react';
import ReactDOM from './react-dom';

class ClassCounter extends React.Component {
  render() {
    return (
      <div id={'counter' + this.props.number}></div>
    )
  }
}

// function FunctionCounter(props) {
//   return (
//     <div id={'counter' + props.number}></div>
//   )
// }
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }
  onClick=()=>{
    console.log('ffff')
    this.setState({
      number : this.state.number+1
    })
  }
  render() {
    return (
      <div id={`node-${this.state.number}`}>
        <span>{this.state.number}</span>
        <button onClick={this.onClick}>button</button>
      </div>
    )
  }
}
let element = React.createElement(Counter, {});
ReactDOM.render(element, document.getElementById('root'))