import React, { useHooks, useState, useCallback, memo, useMemo, useEffect } from 'react';
// import './index.css';

// class Search extends React.Component {
//   state = {
//     number: 0
//   }
//   render() {
//     return (
//       <div className="App">
//         <p>{this.state.number}</p>
//         <div onClick={() => {
//           this.setState({
//             number: this.state.number + 1
//           })
//         }}>Search page</div>
//       </div>
//     );
//   }
// }
// function Search2() {
//   let [state, setState] = useState({ number: 0 });
//   const alertNumber = () => {
//     setTimeout(() => {
//       alert(state.number)
//     }, 3000);
//   }
//   return (
//     <div>
//       <p>{state.number}</p>
//       <button onClick={() => {
//         setState({
//           number: state.number + 1
//         })
//       }}>addddddd</button>
//       <button onClick={alertNumber}>alertNumber</button>
//     </div>
//   )
// }
// //函数式更新
// //如果新的状态需要使用先前的状态计算出来，
// function Search3() {
//   let [state, setState] = useState({ number: 0 });
//   const lazy = () => {
//     setTimeout(() => {
//       setState({
//         number: state.number + 1
//       })
//     }, 3000);
//   }
//   function lazyFunction() {
//     setTimeout(() => {
//       setState(state => ({
//         number: state.number + 1
//       }))
//     }, 3000);
//   }
//   return (
//     <div>
//       <p>{state.number}</p>
//       <button onClick={() => {
//         setState({
//           number: state.number + 1
//         })
//       }}>addddddd</button>
//       <button onClick={lazy}>lzay</button>
//       <button onClick={lazyFunction}>lzayFunction</button>
//     </div>
//   )
// }

// //惰性初始state
// //initialState 初始状态参数只会有组件初始渲染的时候调用 ，后续渲染会被忽略
// function Search4() {
//   let [state, setState] = useState(function () {
//     console.log('初始状态') //只在初始时调用一次
//     return { number: 0, name : '计数器' };
//   });
//   //状态不会自动合并，更新时需要传入完整的值
//   // state之后新旧值没变的话是不会走render
//   console.log('counter5 renderr');

//   return (
//     <div>
//       <p>{state.number}{state.name}</p>
//       <button onClick={() => {
//         setState({
//           ...state,
//           number: state.number + 1
//         })
//       }}>加111111</button>
//       <button onClick={() => {
//         setState(state)
//       }}>加xxxxxx</button>
//     </div>
//   )
// }


// // let lastAddClick;
// function Search6() {
//   let [number,setNumber] = useState(0);
//   let [name,setName] = useState('zhufeng');
//   // 会每次渲染的时候都 生成一个新的函数
//   // 只有在[依赖的变量发生变化]的时候才会重新生成
//   const addCLick = useCallback(()=>{
//     setNumber(number+1)
//   },[number]);//依赖的变量
//   const changeName = useCallback(()=>{
//     setName('taaaaaa')
//   },[name]);
//   console.log(lastAddClick === addCLick)
//   lastAddClick = addCLick;
//   return (
//     <div>
//       <p>{name}{number}</p>
//       <button onClick={addCLick}>加111111</button>
//       <button onClick={changeName}>改名</button>
//     </div>
//   )
// }
// function Child(props) {
//   console.log('renderChild');
//   return <button onClick={props.addClick}>{props.data.number}</button>
// }
// Child = memo(Child);
// let lastAddClick;
// let lastData;
// function Search7() {
//   let [number, setNumber] = useState(0);
//   let [name, setName] = useState('zhufeng');
//   const addClick = useCallback(() => setNumber(number+1), [number]);
//   console.log(lastAddClick === addClick);
//   lastAddClick = addClick;
//   const data = useMemo(()=>({number}),[number]);
//   console.log('lastData === data', lastData === data);
//   lastData = data;
//   return (
//     <div>
//       <input type="text" value={name} onChange={e => setName(e.target.value)} />
//       <Child addClick={addClick} data={data} />
//     </div>
//   )
// }


function Search8() {
  let [number, setNumber] = useState(0);
  let [visible,setVisible] = useState(true);
  if(11){
    useEffect(()=>{

    })
  }
  return (
    <div>
      <p>{number}</p>
      {visible && <div>visible</div>}
    </div>   
  )
}

function App() {
  const [count, setCount] = useState(0);
  const [dummy, setDummy] = useState(0);
  if(count === 1){
    useEffect(
      () => {
        console.log("I'm called on each render when count changes!");
  
        return () => {
          console.log("I'm called after component unmount!");
        };
      },
      [count] // use effect will be called when count changes
    );
  
  }
  function handleClick() {
    setCount(count + 1);
  }
  function handleClickDummy() {
    setDummy(dummy + 1);
  }

  return (
    <>
      <div>You clicked count {count} times!</div>
      <div>You clicked dummy {dummy} times!</div>
      <button onClick={handleClick}>Click me for rendering!</button>
      <button onClick={handleClickDummy}>Click me for not render!</button>
    </>
  );
}
export default App