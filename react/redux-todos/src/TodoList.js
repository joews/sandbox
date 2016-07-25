import React from 'react';

import Todo from "./Todo";
import './TodoList.css';

// Presentational component - redux-agnostic
const TodoList = ({ todos, onClickTodo }) =>
  <ul className="TodoList">
    {todos.map(todo =>
      <Todo key={todo.id} {...todo} onClick={() => onClickTodo(todo.id)} />
    )}
  </ul>

export default TodoList;
