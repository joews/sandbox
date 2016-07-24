import React from 'react';

import Todo from "./Todo";
import TodoFilterToggle from "./TodoFilterToggle";
import './TodoList.css';

// FIXME
let nextTodoId = 1;

export default class TodoList extends React.Component {

  render() {
    const { store, visibility } = this.props;
    const filteredTodos = this.getFilteredTodos();

    return (
      <div className="TodoList">
        <input ref={node => { this.input = node; }} />

        <button onClick={() => {
          store.dispatch({
            type: "ADD_TODO",
            text: this.input.value,
            id: nextTodoId ++
          });

          this.input.value = "";
        }}>
          Add
        </button>

        {filteredTodos.map(todo =>
          <Todo key={todo.id} store={store} todo={todo} />
        )}

        <hr />
        <label>Show: </label>
        <TodoFilterToggle store={store} visibility="SHOW_ALL" activeVisibility={visibility}>
          All
        </TodoFilterToggle>
        <TodoFilterToggle store={store} visibility="SHOW_COMPLETE" activeVisibility={visibility}>
          Complete
        </TodoFilterToggle>
        <TodoFilterToggle store={store} visibility="SHOW_INCOMPLETE" activeVisibility={visibility}>
          Incomplete
        </TodoFilterToggle>
      </div>
    );
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
