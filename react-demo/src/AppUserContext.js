import React, { useEffect, useReducer, useCallback, useState, useContext } from "react";

import logo from './logo.svg';
import './App.css';


function Counter() {
  let { state, setState } = useContext(MyContext);
  return (
    <div>
      <div>
        <p>{state.number}</p>
        <button onClick={() => setState({
          number: state.number + 1
        })}>加加加</button>
      </div>
    </div>
  )
}

let MyContext = React.createContext();
function App() {
  let [state, setState] = useState({ number: 0 })
  return (
    <MyContext.Provider value={{ state, setState }}>
      <Counter />
    </MyContext.Provider>
  )
}

export default App;
