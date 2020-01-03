import React, { useState,useContext } from "react";
const { Provider, Consumer } = React.createContext(null);

const colorContext = React.createContext(null)
function Bar() {
    const color = useContext(colorContext);
    return <div>{color}</div>
  }
function Foo() {
    return <Bar />;
}
export default function App() {
    return (
        <colorContext.Provider value={"red"}>
        <Foo />
        </colorContext.Provider>
    );
}