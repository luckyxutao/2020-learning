import React from 'react';
import logo from './logo.svg';
import './App.css';

function List({data}) {
  return (
      <ul className="data-list">
          {
              data.map(item => {
                  return <li className="data-item" key={item}>{item}</li>
              })
          }
      </ul>
  );
}

export default class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          data: [1, 2, 3],
          a : 2
      };
  }
  componentDidMount(){
      setTimeout(()=>{
          debugger
          this.setState({
              a : 3
          });
          alert(this.state.a)
      })
  }
  render() {
      return (
          <div className="container">
              <h1 className="title">React learning</h1>
              <List data={this.state.data} />
          </div>
      );
  }
}