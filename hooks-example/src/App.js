import React, { useContext } from 'react';
import Banner from './Banner';
import BannerAsync from './BannerAsync';
import './App.css';
import UseConText from './UseConText';
import UseReducer from './UseReducer';
import UseRef from './UseRef';
class App extends React.Component{
  state = {
    show : true
  }

  onAppClick = ()=>{
    this.setState({
      show:false
    })
  }
  render(){
    const { show} = this.state;
    return (
      <div className="App" onClick={this.onAppClick}>
        <UseRef />
      </div>
    );
  }
}

export default App;
