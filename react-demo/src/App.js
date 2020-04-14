import React from "react";
import { render } from "react-dom";

const CountContext = React.createContext(1);

function Button(props) {
  console.log("button render");
  return <button {...props}>{props.count}</button>;
}

class CountedButton extends React.Component {
  static contextType = CountContext;
  render() {
    console.log('counterButton rendered')
    return <Button {...this.props} count={this.context.count} />;
  }
}

class Toolbar extends React.PureComponent {
  render() {
    console.log("Toolbar render");
    return (
      <div>
        <CountedButton />
      </div>
    );
  }
}

export default class App extends React.Component {
  state = {
    updateCount: 0
  };

  render() {
    console.log("app render", this.state.updateCount);
    return (
      <CountContext.Provider value={{ count: this.state.updateCount }}>
        <Toolbar />
        <button
          onClick={() =>
            this.setState(state => ({
              updateCount: state.updateCount + 1
            }))
          }
        >
          update
        </button>
      </CountContext.Provider>
    );
  }
}