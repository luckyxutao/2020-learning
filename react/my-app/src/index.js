import React from './react';
import ReactDOM from './react-dom';


function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { count: state.count + 1 };
    default:
      return state;
  }
}

function FunctionCounter() {
  const [numberObj, setNumber] = React.useState({ number: 0 })
  const [count2State, dispatch2] = React.useReducer(reducer, { count: 0 })
  return (
    <h1>
      <span>{numberObj.number}</span>
      <br/>
      <span>{count2State.count}</span>
      <button onClick={() => setNumber({ number : numberObj.number+1})}>加1</button>
      <button onClick={() => dispatch2({ type: 'ADD' })}>加1222</button>
    </h1>
  )
}
ReactDOM.render(
  <FunctionCounter />,
  document.getElementById('root')
);

// class ClassCounter extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { number: 0 };
//   }
//   onClick = () => {
//     this.setState(state => ({ number: state.number + 1 }));
//   }
//   render() {
//     return (
//       <div id="counter">
//         <span>{this.state.number}</span>
//         <button onClick={this.onClick}>加1</button>
//       </div >
//     )
//   }
// }
// ReactDOM.render(
//   <ClassCounter />,
//   document.getElementById('root')
// );
