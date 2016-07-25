import React from "react";

// FIXME use react-redux
export default class Provider extends React.Component {

  // React API method
  // Defines the context that descendent elements receive
  // Descendents must define the statuc `childContextTypes` to receive context.
  getChildContext() {
    return {
      store: this.props.store
    }
  }

  render() {
    // Invisible component - render the child components only.
    return this.props.children;
  }
}

// Descendents must provide a corresponding childTypes
//  to opt-in to context.
Provider.childContextTypes = {
  store: React.PropTypes.object
}
