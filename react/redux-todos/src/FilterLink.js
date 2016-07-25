import React from "react";
import Link from "./Link";

// Container component: redux-aware. Gets store from context.
// Making this a container means that we don't need to pass down props
//  through the parent hierarchy. This is better encapsulation because
//  it means that parent components don't need to know which props their
//  descendents need.
export default class FilterLink extends React.Component {

  // Because parent components don't have all of the props that
  //  this component needs. If the parent re-renders we may render
  //  a version of this component with stale state. Therefore we
  //  need to subscribe directly to store updates.
  componentDidMount() {
    this.unsubscribe = this.context.store.subscribe(() => {
      // React API method: update component regardless of props or state
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { visibility, children } = this.props;
    const state = this.context.store.getState();

    return (
      <Link
        onClick={() => this.onClickLink(visibility)}
        active={visibility === state.visibility}
      >
        {children}
      </Link>
    );
  }

  onClickLink(filter) {
    this.context.store.dispatch({
      type: "SET_VISIBILITY_FILTER",
      filter
    });
  }
}

// Opt-in to context
FilterLink.contextTypes = {
  store: React.PropTypes.object
}
