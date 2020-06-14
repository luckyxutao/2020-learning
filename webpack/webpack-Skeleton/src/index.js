import React from "react";
import ReactDOM from "react-dom";
let style = { width: "100%", height: "300px", backgroundColor: "orange" };
setTimeout(() => {
    ReactDOM.render(<div style={style}></div>, document.getElementById("root"));
}, 2000);