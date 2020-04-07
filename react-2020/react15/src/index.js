import React, { Component } from 'react';
import MyReact from './react'; //使用内内部的children
import ReactDOM from 'react-dom';

class ChildList extends Component {
  render() {
    return (
      <div>
        {
          MyReact.Children.map(this.props.list, function (v, i) {
            // React.Children.map(this.props.list, function (v, i) {
              return v
            })
        }
      </div>
    )
  }
}
function Pitem({ name }) {
  return <div>{name}</div>
}
class App extends Component {
  render() {
    const child = [
      <Pitem name="xutao"></Pitem>,
      [
        <Pitem name="yyyyy_222"></Pitem>,
        [ <Pitem name="yyyyy_222aaaa"></Pitem>, <Pitem name="yyyyy_222bbb"></Pitem>],
        <Pitem name="xutaochild_333"></Pitem>
      ],
      <Pitem name="xutao222"></Pitem>,
      <Pitem name="xutao333"></Pitem>,
      <Pitem name="xutao444"></Pitem>
    ]
    return (
      <div>
        <p>1</p>
        <button>++++</button>
        <ChildList list={child} />
      </div>
    )
  }
}

let element = <App />;

// class App extends Component {
//   static defaultProps = {
//     baseName: 'app'
//   }
//   render() {
//     return React.createElement("div", null, React.createElement("p", {
//       key: 111,
//       title: 'p-title'
//     }, "1"), React.createElement("button", {
//       key: 222,
//       buttonName: 'button-add'
//     }, "++++"));
//   }

// }

// let element = /*#__PURE__*/React.createElement(App, null);

ReactDOM.render(element, document.getElementById('root'))