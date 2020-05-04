import React from './react';
import ReactDOM from './react-dom';

// class ClassCounter extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { number: 0 };
//   }
//   onClick = () => {
//     this.setState(state => ({ number: state.number+1 }));
//   }
//   render() {
//     return (
//       <div id="counter">
//         <span>{this.state.number}</span>
//         <button onClick={this.onClick}>加1</button>
//       </div>
//     )
//   }
// }
function reducer(state,action){
  switch (action.type) {
    case 'ADD':
      return { count : state.count + 1 }
    default:
      return state;
  }
}
function reducer2(state,action){
  switch (action.type) {
    case 'ADD':
      return { number : state.number + 1 }
    default:
      return state;
  }
}
function FunctionCounter(props){
  const [numberState,dispatch2] = React.useReducer(reducer2,{number:0});
  const [countState,setCount] = React.useState({count:0});
  // const [countState,dispatch] = React.useReducer(reducer,{count:0});

  return (
    <div id="counter">
      <span>number{numberState.number}</span>
      <span>count{countState.count}</span>
      <button onClick={()=>dispatch2({type:'ADD'})}>加number1</button>
      <button onClick={()=>{
        setCount({
          ...countState,
          count :countState.count+1
        })
      }}>useState加count</button>
    </div>
  )
}
ReactDOM.render(
  <FunctionCounter name="计数器" />,
  document.getElementById('root')
);



// let style={
//   border:'3px solid red',
//   margin:'5px'
// }
// let element = (
//   <div id="A1" style={style}>
//     A1
//     <div id="B1" style={style}>
//       B1
//       <div id="C1" style={style}>C1</div>
//       <div id="C2" style={style}>C2</div>
//     </div>
//     <div id="B2" style={style}>B2</div>
//   </div>
// )
// console.log(element)
// ReactDOM.render(
//   element,
//   document.getElementById('root')
// );

// var render2 = document.getElementById('render2');
// render2.addEventListener('click',()=>{
//   let element = (
//     <div id="A1-new" style={style}>
//       A1-new
//       <div id="B1-new" style={style}>
//         B1-new
//         <div id="C1-new" style={style}>C1-new</div>
//         <div id="C2-new" style={style}>C2-new</div>
//       </div>
//       <div id="B2-new" style={style}>B2-new</div>
//       <div id="B3-new" style={style}>B3-new</div>
//     </div>
//   );
//   ReactDOM.render(
//     element,
//     document.getElementById('root')
//   );
// });

// var render3 = document.getElementById('render3');
// render3.addEventListener('click',()=>{
//   let element = (
//     <div id="A1-new2" style={style}>
//       A1-new2
//       <div id="B1-new2" style={style}>
//         B1-new2
//         <div id="C1-new2" style={style}>C1-new2</div>
//         <div id="C2-new2" style={style}>C2-new2</div>
//       </div>
//       <div id="B2-new2" style={style}>B2-new2</div>
//     </div>
//   );
//   ReactDOM.render(
//     element,
//     document.getElementById('root')
//   );
// });