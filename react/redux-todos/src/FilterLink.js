import React from "react";
import { connect } from "react-redux";

import Link from "./Link";

// Container component: redux-aware. Gets store from context.
// Making this a container means that we don't need to pass down props
//  through the parent hierarchy. This is better encapsulation because
//  it means that parent components don't need to know which props their
//  descendents need.
class FilterLink extends React.Component {

  render() {
    const {
      active,
      children,
      onClickLink
    } = this.props;

    return (
      <Link
        onClick={onClickLink}
        active={active}
      >
        {children}
      </Link>
    );
  }

}

// mapStateToProps gets the Component's own props
//  as the second argument
function mapStateToProps(state, ownProps) {
  const active = state.visibility === ownProps.visibility;
  return {
    active
  };
}

// mapDispatchToprops also gets the Component's own props
function mapDispatchToProps(dispatch, ownProps) {
  return {
    onClickLink() {
      dispatch({
        type: "SET_VISIBILITY_FILTER",
        filter: ownProps.visibility
      });
    }
  }
}

const wrap = connect(mapStateToProps, mapDispatchToProps);
export default wrap(FilterLink);
