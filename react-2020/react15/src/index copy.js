import React, { Component } from './react';
import ReactDOM from 'react-dom';



class App extends Component {
  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'red'
      },
      key :25
    }, "1"), /*#__PURE__*/React.createElement("button", {
      id: "button",
      key : 'btn_key'
    }, "++++"));
  }

}

let element = /*#__PURE__*/React.createElement(App, null);

ReactDOM.render(element, document.getElementById('root'))