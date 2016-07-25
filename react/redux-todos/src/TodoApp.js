import React from 'react';

import TodoList from "./TodoList";
import AddTodo from "./AddTodo";
import TodoFooter from "./TodoFooter";
import "./TodoApp.css";

// FIXME
let nextTodoId = 1;

//  Container component - redux-aware. Gets store from context.
export default class TodoApp extends React.Component {

  render() {
    const filteredTodos = this.getFilteredTodos();

    return (
      <div className="TodoApp">
        {/* presentation components: pass action dispatchers and data as props */}
        <AddTodo onClickAdd={this.onClickAdd.bind(this)}/>
        <TodoList todos={filteredTodos} onClickTodo={this.onClickTodo.bind(this)} />
        <TodoFooter/>
      </div>
    );
  }

  onClickTodo(id) {
    this.context.store.dispatch({
      type: "TOGGLE_TODO",
      id
    });
  }

  onClickAdd(text) {
    this.context.store.dispatch({
      type: "ADD_TODO",
      id: nextTodoId ++,
      text
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
TodoApp.contextTypes = {
  store: React.PropTypes.object
}
