import React from 'react';

import TodoList from "./TodoList";
import AddTodo from "./AddTodo";
import TodoFooter from "./TodoFooter";
import "./TodoApp.css";

// FIXME
let nextTodoId = 1;

//  Container component - redux-aware
export default class TodoApp extends React.Component {

  render() {
    const filteredTodos = this.getFilteredTodos();

    return (
      <div className="TodoApp">
        {/* presentation components: pass everything as props */}
        <AddTodo onClickAdd={this.onClickAdd.bind(this)}/>
        <TodoList todos={filteredTodos} onClickTodo={this.onClickTodo.bind(this)} />

        {/* presentational compoent, but contains a container so
            we need to pass store as a transitive prop. We will
            use context to avoid this.
         */}
        <TodoFooter store={this.props.store}/>
      </div>
    );
  }

  onClickTodo(id) {
    this.props.store.dispatch({
      type: "TOGGLE_TODO",
      id
    });
  }

  onClickAdd(text) {
    this.props.store.dispatch({
      type: "ADD_TODO",
      id: nextTodoId ++,
      text
    });
  }

  getFilteredTodos() {
    const { visibility, todos } = this.props;
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
