import React, { useState } from "react";

class BannerClass extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        count: 0,
        name: "alife"
      };
    }
    render() {
      const { count } = this.state;
      return (
        <div>
          Count: {count}
          <button onClick={() => this.setState({ count: count + 1 })}>+</button>
          <button onClick={() => this.setState({ count: count - 1 })}>-</button>
        </div>
      );
    }}

    export default function Banner(props){
        const [obj,setObj] = useState({
            count:0,
            name:'alife'
        });
        return (
            <div>
            Count: {obj.count}
            <button onClick={() => setObj({...obj,count:obj.count+1})}>+</button>
            <button onClick={() => setObj({...obj,count:obj.count-1})}>-</button>
          </div>
        );
    }