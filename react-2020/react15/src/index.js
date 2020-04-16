import React, { Component } from './react';
import ReactDOM from './react-dom';

let onClick = (e) => {
  bb(e);
  console.log(e);
}
function bb(e){
  console.log(e);
  
}
let element = React.createElement('button', {
  id: 'sayHello', onClick
},
  'say', React.createElement('span', {
    style: {
      color: 'red'
    },
    key:'aaaa'
  }, 'Hello')
);
console.log(element);

ReactDOM.render(element, document.getElementById('root'))