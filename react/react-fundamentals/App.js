import React from "react";

// Stateful class component
export class App extends React.Component {
  constructor() {
    super();

    // State belongs to the component
    // This parent contains the root state. It passes
    //  it down to children as props
    this.state = {
      subtitle: "Subtitle",
      messages: ["First!", "Second!"]
    };
  }

  // custom event handler
  update(e, childId) {
    this.setState({
      subtitle: `${e.target.value} (${childId})`
    });
  }

  render() {
    // Without JSX:
    // return React.createElement("h1", { className: "title" }, "Hi no JSX!")

    // Props are passed by the parent component
    const { message } = this.props;

    return (
      <div>
        <h1>{this.props.title}</h1>
        <p>{this.state.subtitle}</p>
        {this.state.messages.map((message, i) =>
          <Widget
            key={i}
            message={message}
            title="Widget the first"
            update={(e) => this.update(e, i)}
          />
        )}
      </div>
    );
  }
}

App.propTypes = {
  title: React.PropTypes.string.isRequired
};

App.defaultProps = {
  title: "Default title!"
};

const Widget = ({ title, message, update }) =>
  <div>
    <h1 className="title">{title}</h1>
    <p>{message}</p>
    <label>Change the subtitle:</label>
    <input id="title-input" type="text" onChange={update} />
  </div>
