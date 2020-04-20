import React, { Component } from './react';
import ReactDOM from './react-dom';

function MyComponent(props){
  function onClick(){
    alert()
  }
  return (
    <div onClick={onClick} style={{color:'green'}}>2222</div>
  )
}

class ClassComponent extends Component{
    render(){
      return (
        <div onClick={()=>{
          console.log('gg')
        }} style={{color:'green'}}>2222</div>
      )
    }
}
// let element = React.createElement('button', {
//   id: 'sayHello', onClick
// },
//   'say', React.createElement('span', {
//     style: {
//       color: 'red'
//     },
//     key:'aaaa'
//   }, 'Hello')
// );
// console.log(element);

ReactDOM.render(<ClassComponent />, document.getElementById('root'))