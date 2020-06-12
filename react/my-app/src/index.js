import React,{useRef, forwardRef,useImperativeHandle,useState} from 'react';
import ReactDOM from 'react-dom';

function Child(props,ref){
  const inputRef = useRef();
  useImperativeHandle(ref,()=>(
    {
      mar:20,
      focus(){
        inputRef.current.focus();
      }
    }
  ));
  return (
    <input type="text" ref={inputRef}/>
  )
}

Child = forwardRef(Child);

function Parent(){
  let [number,setNumber] = useState(0); 
  const inputRef = useRef();
  function getFocus(){
    console.log(inputRef.current);
    inputRef.current.value = 'focus';
    inputRef.current.focus();
  }
  return (
      <>
        <Child ref={inputRef}/>
        <button onClick={()=>setNumber({number:number+1})}>+</button>
        <button onClick={getFocus}>获得焦点</button>
      </>
  )
}
function render(){
    ReactDOM.render(<Parent/>,document.getElementById('root'));
}
render();