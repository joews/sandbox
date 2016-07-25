import React from "react";
import Link from "./Link";

// Container component: redux-aware
// Making this a container means that we don't need to pass down props
//  through the parent hierarchy. This is better encapsulation because
//  it means that parent components don't need to know which props their
//  descendents need.
// For now we need to pass the store down as a prop; soon it will be passed
//  implicitly as context.
export default class FilterLink extends React.Component {

  // Because parent components don't have all of the props that
  //  this component needs. If the parent re-renders we may render
  //  a version of this component with stale state. Therefore we
  //  need to subscribe directly to store updates.
  componentDidMount() {
    this.unsubscribe = this.props.store.subscribe(() => {
      // React API: update component regardless of props or state
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { visibility, store, children } = this.props;

    // Fetch state straight from the Redux store
    // For now we need to get the store from a prop
    const state = store.getState();
    const activeVisibility = state.visibility;

    return (
      <Link
        onClick={() => this.onClickLink(visibility)}
        active={visibility === activeVisibility}
      >
        {children}
      </Link>
    );
  }

  onClickLink(filter) {
    this.props.store.dispatch({
      type: "SET_VISIBILITY_FILTER",
      filter
    });
  }
}
