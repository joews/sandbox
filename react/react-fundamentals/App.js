import React from "react";
import ReactDOM from "react-dom";

//
// Messy smorgasbord of React components
//

// Stateful class component
export class App extends React.Component {

  constructor() {
    super();

    // State belongs to the component
    // This parent contains the root state. It passes
    //  it down to children as props
    this.state = {
      subtitle: "Subtitle",
      messages: ["First!", "Second!"],
      color: {
        r: 0,
        g: 0,
        b: 0
      },
      counterIds: []
    };
  }

  //
  // Child event handlers
  //

  // called when any widget changes its text value
  updateWidget(e, childId) {
    const newState = Object.assign({}, this.state, {
      subtitle: `${e.target.value} (edited by widget ${childId})`
    });

    this.setState(newState);
  }

  // Called when any slider updates its value
  updateSlider(e) {
    const color = {
      r: +this.refs.redSlider.refs.input.value,
      g: +this.refs.greenSlider.refs.input.value,
      b: +this.refs.blueSlider.refs.input.value,
    }

    const newState = Object.assign({}, this.state, { color });
    this.setState(newState);
  }

  addCounter() {
    const nextId = this.state.counterIds.length + 1;
    const counterIds = [...this.state.counterIds, nextId];
    const newState = Object.assign({}, this.state, { counterIds });
    this.setState(newState);
  }

  popCounter() {
    const counterIds = this.state.counterIds.slice(0, -1);
    const newState = Object.assign({}, this.state, { counterIds });
    this.setState(newState);
  }

  //
  // rendering methods
  //

  render() {
    // Without JSX:
    // return React.createElement("h1", { className: "title" }, "Hi no JSX!")

    // Props are passed by the parent component
    const { message } = this.props;
    const { r, g, b } = this.state.color;
    const rgba = [r, g, b, 1].join(", ");

    return (
      <div>
        <h1 style={{ color: `rgba(${rgba})` }} >
          {this.props.title}
        </h1>
        <p>{this.state.subtitle}</p>
        <hr />

        {/* mapping array state to child components */}
        {this.state.messages.map((message, i) =>
          <Widget
            key={i}
            message={message}
            title={`Widget ${i}`}
            update={(e) => this.updateWidget(e, i)}
          />
        )}
        <hr />

        {/* refs */}
        <h2>Change the title colour:</h2>
        R
        <Slider ref="redSlider" value={r} update={this.updateSlider.bind(this)} />
        <span style={{ color: `rgba(${r}, 0, 0, 1)` }}>({r})</span>
        <br/>

        G
        <Slider ref="greenSlider" value={g} update={this.updateSlider.bind(this)} />
        <span style={{ color: `rgba(0, ${g}, 0, 1)` }}>({g})</span>
        <br/>

        B
        <Slider ref="blueSlider" value={b} update={this.updateSlider.bind(this)} />
        <span style={{ color: `rgba(0, 0, ${b}, 1)` }}>({b})</span>
        <br/>
        <hr />

        {/* components and other elements can be nested with child properties  */}
        <h2>Child properties</h2>
        <Button>child properties!</Button>
        <Button>
          Grr!
          <TableFlip />
        </Button>

        {/* lifecycle example */}
        <h2>Lifecyle</h2>
        <Button onclick={this.addCounter.bind(this)}>Add counter</Button>
        <Button onclick={this.popCounter.bind(this)}>Pop counter</Button>
        <br/>

        {this.state.counterIds.map((id) =>
          <Counter key={id} id={id}/>
        )}

      </div>
    );
  }
}

// Prop type hints
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

// A component that will be assigned to a ref.
// Although it's stateless, functional components cannot be refs
//  so we need to use a class.
class Slider extends React.Component {
  render() {
    const { value, update } = this.props;
    return (
      <input ref="input" type="range"
        value={value} min="0" max="255"
        onChange={this.props.update}
      />
    );
  }
}

// A component with child properties (transcluded content)
const Button = ({ children, onclick }) =>
  <button onClick={onclick}>{children}</button>;

const TableFlip = () => <span>"(╯°□°）╯︵ ┻━┻"</span>;

// Lifecycle methods kitchen sink
class Counter extends React.Component {
  constructor() {
    super();
    this.state = {
      value: 0
    };
  }

  // Mounting
  componentWillMount() {
    console.log(`Counter ${this.props.id} will mount`);
  }

  componentDidMount() {
    console.log(`Counter ${this.props.id} mounted`);
  }

  componentWillUnmount() {
    console.log(`Counter ${this.props.id} will unmount`);
  }

  // Updating

  // The component's updates have been flushed to the DOM
  componentDidUpdate(oldProps, oldState) {
    console.log(`Counter ${this.props.id} flushed to the DOM`, oldProps, oldState);
  }

  // New props!
  componentWillReceiveProps(nextProps) {
    console.log(`Counter ${this.props.id} will receive props`, nextProps);
  }

  // Return true if the component should have updates flushed to the DOM.
  // For avoiding redundant re-renders.
  shouldComponentUpdate(nextProps, nextState) {
    // Only render every third increment
    return nextState.value % 3 == 0;
  }

  // Event handlers
  increment() {
    this.setState({ value: this.state.value + 1 });
  }

  render() {
    return (
      <Button onclick={this.increment.bind(this)}>
        { this.state.value }
      </Button>
    );
  }

}
