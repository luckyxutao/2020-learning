import React, { useEffect, useReducer, useCallback, useState, useRef, useContexChild, forwardRef, useImperativeHandle, useLayoutEffect } from "react";

import logo from './logo.svg';
import './App.css';


function LayoutEffect(){
  let [color,setColor] = useState('red');
  useLayoutEffect(()=>{
    alert(color);
  })
  useEffect(()=>{
    debugger
    console.log('当前的颜色useEffect',color)
  })
  return (
    <>
      <div id="myDiv" style={{backgroundColor:color}}>颜色</div>
      <button onClick={()=>setColor('red')}>红</button>
      <button onClick={()=>setColor('yellow')}>黄</button>
      <button onClick={()=>setColor('blue')}>蓝</button>
    </>
  )
}

export default LayoutEffect;
