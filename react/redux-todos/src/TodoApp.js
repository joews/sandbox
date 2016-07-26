import React from 'react';

import VisibleTodoList from "./VisibleTodoList";
import AddTodo from "./AddTodo";
import TodoFooter from "./TodoFooter";
import "./TodoApp.css";

// Top-level component. Children are container components.
// The `params` prop comes from the react-router Route.
const TodoApp = () =>
  <div className="TodoApp">
    <AddTodo />
    <VisibleTodoList />
    <TodoFooter/>
  </div>

export default TodoApp;
