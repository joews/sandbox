import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { toggleTodo } from "./actions";
import { getFilteredTodos } from "./reducer";
import TodoList from "./TodoList";

class VisibleTodoList extends React.Component {
  render() {
    const { todos, onClickTodo } = this.props;
    return (
      <TodoList todos={todos} onClickTodo={onClickTodo.bind(this)} />
    );
  }
}

//
// react-redux plumbing
// `connect` does three things:
// * It wires up the Component to recieve the store from context.
// * It handles store subscriptions.
// * It merges the output from `mapStateToProps` and
//   `mapDispatchToProps` with the component's passed props
//   to define the Component's props.


// Map redux store state to the component props
function mapStateToProps(state, { params }) {
  return {
    todos: getFilteredTodos(state, params.filter || 'all')
  }
}

// connect is curried; it returns a function that decorates the component.
// Uses mapDispatchToProps shorthand: if the prop function (onClickTodo)
//  and action creator (toggleTodo) have matching arguments, we can use an
//  object to define the mapping.
const wrap = connect(mapStateToProps, {
  onClickTodo: toggleTodo
});

// withRouter injects router `params` as a component prop
export default withRouter(wrap(VisibleTodoList));
