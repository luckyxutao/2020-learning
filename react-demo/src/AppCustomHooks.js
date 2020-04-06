import React, { useEffect, useReducer, useCallback, useState, useRef, useContexChild, forwardRef, useImperativeHandle, useLayoutEffect } from "react";

import logo from './logo.svg';
import './App.css';

function useCounter(){
  let [number,setNumber] = useState(0);
  useEffect(()=>{
    const timer = setInterval(() => {
      setNumber(x=>Math.random())
    }, 1000);
    return ()=>{
      clearInterval(timer);
    }
  });
  return number;
}

function Counter1(){
  let number = useCounter();
  return (
    <di>{number}</di>
  )
}
function Counter2(){
  let number = useCounter();
  return (
    <di>{number}</di>
  )
}

function App(){
  return (
    <div>
      <Counter1/>
      <div></div>
      <Counter2/>
    </div>
  )
}
export default App;
