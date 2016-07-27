import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import * as actions from "../actions";
import { getFilteredTodos } from "../reducers";
import TodoList from "./TodoList";

class VisibleTodoList extends Component {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.filter !== prevProps.filter) {
      this.fetchData();
    }
  }

  fetchData() {
    const { filter, fetchTodos } = this.props;
    fetchTodos(filter);
  }

  render() {
    const { toggleTodo, ...rest } = this.props;
    return (
      <TodoList {...rest} onClickTodo={toggleTodo} />
    );
  }
}

VisibleTodoList.propTypes = {
  filter: PropTypes.oneOf(['all', 'active', 'complete']).isRequired,
  fetchTodos: PropTypes.func.isRequired,
  toggleTodo: PropTypes.func.isRequired,
};


//
// react-redux plumbing
// `connect` does three things:
// * It wires up the Component to recieve the store from context.
// * It handles store subscriptions.
// * It merges the output from `mapStateToProps` and
//   `mapDispatchToProps` with the component's passed props
//   to define the Component's props.


// Map redux store state to the component props
const mapStateToProps = (state, { params }) => {
  const filter = params.filter || "all";
  return {
    todos: getFilteredTodos(state, filter),
    filter,
  };
};

// connect is curried; it returns a function that decorates the component.
// Uses mapDispatchToProps shorthand: if the prop function (onClickTodo)
//  and action creator (toggleTodo) have matching arguments, we can use an
//  object to define the mapping.
const wrap = connect(mapStateToProps, actions);

// withRouter injects router `params` as a component prop
export default withRouter(wrap(VisibleTodoList));
