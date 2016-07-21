import React from "react";

// Stateful class component
export class App extends React.Component {
  constructor() {
    super();

    // State belongs to the component
    // In this example the component controls its own state.
    // It's sometimes better to store state externally.
    this.state = {
      title: "Hi from state"
    };
  }

  // custom event handler
  update(e) {
    console.log("hi");
    this.setState({
      title: e.target.value
    });
  }

  render() {
    // Without JSX:
    // return React.createElement("h1", { className: "title" }, "Hi no JSX!")

    // Props are passed by the parent component
    const { message } = this.props;

    return (
      <div>
        <h1 className="title">{this.state.title}</h1>
        <p>{this.props.message}</p>
        <input id="title-input" type="text" onChange={this.update.bind(this)} />
      </div>
    );
  }
}

App.propTypes = {
  message: React.PropTypes.string,
  id: React.PropTypes.number.isRequired
};

App.defaultProps = {
  id: 0
};

// Stateless components
// Props are passed as the argument
export const StatelessApp = ({ message }) =>
  <div>
    <h1 className="title">Hi stateless function!</h1>
    <p>{message}</p>
  </div>;

