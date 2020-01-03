import React, { useState, useEffect,useRef } from "react";

let timer = null;

export default function Banner(props){
    const [count,setCount] = useState(0);
    const inputEl = useRef(null);

    useEffect(()=>{
      document.title = 'componentDidMount' + count;
      console.log(inputEl.current)
    },[count]);

    useEffect(()=>{
      timer = setInterval(() => {
        setCount(prevCount=>prevCount+1);
      }, 1000);
      return ()=>{
        document.title = 'componentWillUnmount';
        clearInterval(timer);
      }
    },[]);
  return (
    <div style={{backgroundColor:'yellow'}}>
      Count: {count}
      <input ref={inputEl} />
      <button onClick={() => clearInterval(timer)}>clear</button>
    </div>
  );
}