import React from 'react';

import Todo from "./Todo";
import './TodoList.css';

// FIXME
let nextTodoId = 1;

export default class TodoList extends React.Component {
  render() {
    const { store, todos } = this.props;

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

        {todos.map(todo =>
          <Todo key={todo.id} store={store} todo={todo} />
        )}
      </div>
    );
  }
}
