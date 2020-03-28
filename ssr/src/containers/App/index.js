import React from 'react';
// import './index.css';
// import {connect} from 'react-redux';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './action';
import { bindActionCreators } from 'redux';

class App extends React.Component {
  constructor(props) {
    super(props)
  }
  // async asyncData() {
  //   await this.props.fetchBooks({ page: 1 })
  // }
  componentDidMount(){
  }
  //此方法用一初次异步请求数据
  static getInitialProps(store){
    return store.dispatch(actions.fetchBooks({ page: 1 }));
  }
  onIncrementClick = () => {
    this.props.increment();
  }
  onDecrementClick = () => {
    this.props.decrement();
  }
  render() {
    const { list} = this.props.App;
    console.log(this.props)
    if(!list){
      return null;
    }
    return (
      <div className="App">
        <div>counter:{this.props.App && this.props.App.counter}</div>
        <div className="button" onClick={this.onIncrementClick}>increment</div>
        <div className="button" onClick={this.onDecrementClick}>decrement</div>
        <ul>
        {
          list.map(v=>{
            return <li key={v.id}>{v.title}</li>
          })
        }
        </ul>
      </div>
    );
  }
}

function mapStateProps(state) {
  return {
    App: state.App
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}
export default connect(mapStateProps, mapDispatchToProps)(App);
