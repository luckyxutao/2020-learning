import './client'
let root = document.getElementById('root');
function render(){
   let title = require('./title').default;
   root.innerHTML= title;
}
render();
if(module.hot){
   //如果title变化 了，会重新调回调函数
   module.hot.accept(['./title'],render)
}