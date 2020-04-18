import React from 'react';
import './App.css';
import { request } from './utils/request';
function App() {
  function onClick() {
    request({
      url: '/test'
    }).then(res => {
      console.log(res);
    })
  }
  return (
    <div className="App">
      <div onClick={onClick}>发送请求</div>
    </div>
  );
}

export default App;
