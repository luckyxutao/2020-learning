import React, { useEffect, useReducer, useCallback, useState, useRef, useContexChild, forwardRef, useImperativeHandle } from "react";

import logo from './logo.svg';
import './App.css';
let currentRefObject;
let lastRef;
function Child(prop,ref){
  let refObject = useRef();
  useImperativeHandle(ref,()=>({
    focus(){
      refObject.current.focus();
    },
    myCustom(){
      console.log('xxxxx')
    }
  }));
  return (
    <div>
      <input ref={refObject} type="text" />
    </div>
  )
}
var ForwardedChild = forwardRef(Child);
function App(){
  let [number,setNumber] = useState(0);
  let refObject = useRef();
  function getFocus(){
    refObject.current.myCustom()
  }
  return (
    <div>
      <ForwardedChild ref={refObject} />
      <button onClick={getFocus}>+++</button>
    </div>
  )
}
export default App;
