import React, { Component } from './react';
import ReactDOM from 'react-dom';

// class App extends Component{
//   render(){
//     return (
//       <div>
//         <p>1</p>
//         <button>++++</button>
//       </div>
//     )
//   }
// }

// let element = <App />;

class App extends Component {
  static defaultProps = {
    baseName: 'app'
  }
  render() {
    return React.createElement("div", null, React.createElement("p", {
      key: 111,
      title: 'p-title'
    }, "1"), React.createElement("button", {
      key: 222,
      buttonName: 'button-add'
    }, "++++"));
  }

}

let element = /*#__PURE__*/React.createElement(App, null);

ReactDOM.render(element, document.getElementById('root'))