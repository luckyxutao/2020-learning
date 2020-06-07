import React, { Component} from "react";

class Suspense extends React.Component {
  state = {
    promise: null
  }

  componentDidCatch(e) {
    debugger
    if (e instanceof Promise) {
      this.setState({
        promise: e
      }, () => {
        e.then(() => {
          debugger
          this.setState({
            promise: null
          })
        })
      })
    }
  }

  render() {
    const { fallback, children } = this.props
    debugger
    const { promise } = this.state
    return <>
    {children}
    </>
  }
}


const HomeComponent = React.lazy(()=>import('./Home'));
debugger
export default class App extends React.Component {
  getData(){
    return new Promise((resolve,reject)=>{
      setTimeout(() => {
        resolve("数据加载完毕");
      }, 2000);
    });
  }
  render() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <HomeComponent />
      </Suspense>
    );
  }
}