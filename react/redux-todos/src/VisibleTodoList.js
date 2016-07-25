import React from "react";
import TodoList from "./TodoList";

export default class VisibleTodoList extends React.Component {

  // Container lifecycle.
  // FIXME use react-redux
  componentDidMount() {
    this.unsubscribe = this.context.store.subscribe(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const filteredTodos = this.getFilteredTodos();

    return (
      <TodoList todos={filteredTodos} onClickTodo={this.onClickTodo.bind(this)} />
    );
  }

  onClickTodo(id) {
    this.context.store.dispatch({
      type: "TOGGLE_TODO",
      id
    });
  }

  getFilteredTodos() {
    const { visibility, todos } = this.context.store.getState();
    switch (visibility) {
      case "SHOW_COMPLETE":
        return todos.filter(todo => todo.completed);
      case "SHOW_INCOMPLETE":
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }
}

// Opt-in to context
// FIXME react-redux
VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
}
