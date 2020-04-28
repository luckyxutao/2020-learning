// import React, { Component } from './react';
// import ReactDOM from './react-dom';
import React, { Component } from './react';
import ReactDOM from './react-dom';

class ChildMan extends React.Component {
  // shouldComponentUpdate(nextProps,nextState){
  //   return true
  // }
  // componentWillUpdate(nextProps,nextState){

  // }
  render() {
    const { number } = this.props;
    return (
      <div>number is : {number}</div>
    )
  }

}

// class Counter extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       number:0,
//       list: [{
//         id: 111,
//         name: 'aaaa'
//       }, {
//         id: 222,
//         name: 'bbbb'
//       }, {
//         id: 333,
//         name: 'cccc'
//       }, {
//         id: 444,
//         name: 'dddd'
//       }]
//     }
//   }
//   onClick = () => {
//     console.log('ffff')
//     // this.setState({
//     //   number:this.state.number+1
//     // })
//     this.setState({
//       list: [{
//         id: 222,
//         name: 'bbbb'
//       }, {
//         id: 111,
//         name: 'aaaa'
//       }, {
//         id: 444,
//         name: 'dddd'
//       }]
//     })
//   }
//   render() {
//     return (
//       <div style={{ padding: '20px' }}>
//         <ul>
//           {
//             this.state.list.map((v, i) => {
//               return <li key={v.id}>{v.name}</li>
//             })
//           }
//         </ul>
//         {/* <ChildMan number={this.state.number} /> */}
//         <button onClick={this.onClick}>button</button>
//       </div>
//     )
//   }
// }


class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number:0
    }
  }

  onClick = () => {
    // alert('xxxxx')
    // debugger
    this.setState({
      number:this.state.number+1
    });
    // this.setState({
    //   number:this.state.number+1
    // });
    // this.setState({
    //   number:this.state.number+1
    // })
  }
  render() {
      return (
        <div style={{ padding: '20px'}}>
          {/* <ChildMan number={this.state.number} /> */}
          <span>{this.state.number}</span>
          <button style={{backgroundColor:'red' }} onClick={this.onClick}>button</button>
        </div>
      )
  }
}
let element = React.createElement(Counter, {});
// debugger
ReactDOM.render(element, document.getElementById('root'))