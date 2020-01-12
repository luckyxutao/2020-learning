import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router,Route } from 'react-router-dom';
function AsyncComponent(loadComponent,placeholder='loading……'){
    return class AyncComponent extends React.Component{
        state = {
            Child:null
        }
        async componentDidMount(){
            loadComponent().then(res=>{
                this.setState({
                    Child:res.default
                })
            })
        }
        render(){
            const { Child } = this.state;
            return (
                Child ? <Child {...this.props} /> : placeholder
            );
        }
    }    
}

function mixins(...list) {
    return function (target) {
      Object.assign(target.prototype, ...list)
    }
}

function testable(isTestable) {
    return function(target){
        target.prototype.isTestable = isTestable;//添加实例上
        target.isOk = true;//添加到类上 static
    }
}

function readonly(target,name,descriptor){
    descriptor.writable = false;
    return descriptor;
  // descriptor对象原来的值如下
  // {
  //   value: specifiedFunction,
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };  

}

function delay(delay) {
    return function(target,name,descriptor){
        console.log(`execute----delay decorator${delay}`)
        var oldValue = descriptor.value;
        descriptor.value = function(){
            // setTimeout(() => {
                console.log(`delay after,${delay}`);
                return oldValue.apply(this,arguments);
            // }, delay);
        }
    }
}

function log(target,name,descriptor){
    console.log('execute----log decorator')
    var oldValue = descriptor.value;
    descriptor.value = function(){
        console.log(`calling ${name} with`,arguments);
        return oldValue.apply(this,arguments);
    }
    // descriptor.value
}


@testable(true)
class MyTestableClass {
    print(msg){
        console.log(msg)
    }
  // ...
}


const foo = {
    print(msg){
        console.log(msg)
    }
}
class Animal{
    constructor(name){
        this.name = name;
    }
    eat(){
        // console.log(this.isTestable)
        // this.print(this.name);
    }
    @delay(1000)
    @delay(2000)
    @log
    add(a,b){
        return a+b;
    }
}

var per = new Animal('dog');
var re = per.add(35,15);
// console.log(re)
// per.readOnlyAttr = 35


const App = ()=>{
    return (
        <Router>
            <Route path="/m1" component={AsyncComponent(()=>{
                return import('./pages/m1');
            })} />
            <Route path="/m2" component={AsyncComponent(()=>{
                return import('./pages/m2');
            })} />
        </Router>
    )
}
ReactDOM.render(<App />, document.getElementById('root'));