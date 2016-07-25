import React from "react";
import { connect } from "react-redux";

import TodoList from "./TodoList";

class VisibleTodoList extends React.Component {
  render() {
    const { todos, onClickTodo } = this.props;

    return (
      <TodoList todos={todos} onClickTodo={onClickTodo.bind(this)} />
    );
  }
}

// Moving getFilteredTodos outside the Component makes it a pure function,
//  so it's easier to test. This change is necessary to make it work with
//  mapStateToProps.
function getFilteredTodos(todos, visibility) {
  switch (visibility) {
    case "SHOW_COMPLETE":
      return todos.filter(todo => todo.completed);
    case "SHOW_INCOMPLETE":
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
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
function mapStateToProps(state) {
  return {
    todos: getFilteredTodos(state.todos, state.visibility)
  }
}

// Map redux store dispatch function to component props
function mapDispatchToProps(dispatch) {
  return {
    onClickTodo(id) {
      dispatch({ type: "TOGGLE_TODO", id });
    }
  }
}

// connect is curried; it returns a function that decorates the component.
const wrap = connect(mapStateToProps, mapDispatchToProps);

export default wrap(VisibleTodoList);
