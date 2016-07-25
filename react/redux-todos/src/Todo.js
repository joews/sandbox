import React from "react";
import "./todo.css";

// Presentational component - redux-agnostic
const Todo = ({ completed, text, onClick }) =>
  <li
    // TODO use the classnames library
    className={completed ? "Todo Todo--complete" : "Todo"}
    onClick={onClick}
  >
    {text}
  </li>

export default Todo;
