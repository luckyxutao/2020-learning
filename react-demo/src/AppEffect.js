import React, { useEffect, useReducer, useCallback, useState, useContext } from "react";

import logo from './logo.svg';
import './App.css';

//  class Counter extends React.Component{
//   state = {
//     number : 0
//   }
//   componentDidMount(){
//     document.title = this.state.number;
//   }
//   componentDidUpdate(){
//     document.title = this.state.number;
//   }
//   render(){
//     return (
//       <div>
//         <div>{this.state.number}</div>
//         <button onClick={()=>{
//           this.setState({
//             number : this.state.number+1
//           })
//         }}>
//           +
//         </button>
//       </div>
//     )
//   }
//  }

function Counter(){
  let [state,setState] = useState({number:0});
  // 没给第二个参数，函数会在每次执行后渲染后调用
    useEffect(()=>{
      console.log('useEffect')
      let timer = setInterval(() => {
        setState(x=>{
          return {
            number : x.number+1
          }
        })
      }, 1000);
      return ()=>{
        clearInterval(timer)
      }
    },[]);

  return (
    <div>
      <p>{state.number}</p>
      <button onClick={()=>{
        setState({
          number :state.number+1
        })
      }}>
        +
      </button>
    </div>
  )
}

function App(){
  let [visible,setVisible] = useState(true);
  return (
    <div onClick={()=>setVisible(false)}>
      <div>22222</div>
      {
        visible && <Counter />
      }
    </div>
  )
}
export default App;
