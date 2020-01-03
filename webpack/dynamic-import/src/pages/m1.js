import React from "react";

function DelayComponent(loadComponent,delay=2000,placeholder='loading……'){
  return class AyncComponent extends React.Component{
      state = {
          Child:null
      }
      async componentDidMount(){
          this.timer = setTimeout(() => {
            loadComponent().then(res=>{
                this.setState({
                    Child:res.default
                })
            })
          }, delay);
      }

      componentWillUnmount(){
        this.timer && clearTimeout(this.timer);
      }

      render(){
          const { Child } = this.state;
          return (
              Child ? <Child {...this.props} /> : placeholder
          );
      }
  }    
}

const DelayM1Child = DelayComponent(()=>import('./m1Child'),2000);

export default class M1 extends React.Component {
  render() {
    return (
      <div>
        <div>m111111</div>
        <DelayM1Child />
      </div>
    )
  }
}