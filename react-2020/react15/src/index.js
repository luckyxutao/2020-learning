import React, { Component } from './react';
import ReactDOM from './react-dom';


class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [{
        id: 111,
        name: 'aaaa'
      }, {
        id: 222,
        name: 'bbbb'
      }, {
        id: 333,
        name: 'cccc'
      }, {
        id: 444,
        name: 'dddd'
      }]
    }
  }
  onClick = () => {
    console.log('ffff')
    this.setState({
      list: [{
        id: 222,
        name: 'bbbb'
      }, {
        id: 333,
        name: 'cccc'
      }, {
        id: 111,
        name: 'aaaa'
      }, {
        id: 444,
        name: 'dddd'
      }]
    })
  }
  render() {
    return (
      <div style={{ padding: '20px' }}>
        <ul>
          {
            this.state.list.map((v, i) => {
              return <li key={v.id}>{v.name}</li>
            })
          }
        </ul>
        <button onClick={this.onClick}>button</button>
      </div>
    )
  }
}
let element = React.createElement(Counter, {});
ReactDOM.render(element, document.getElementById('root'))