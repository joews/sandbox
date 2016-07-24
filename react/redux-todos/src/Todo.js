import React from "react";
import "./todo.css";

const Todo = ({ store, todo }) =>
  <li
    // TODO use the classnames library
    className={todo.completed ? "Todo Todo--complete" : "Todo"}
    onClick={() => {
      store.dispatch({
        type: "TOGGLE_TODO",
        id: todo.id
      })
    }}
  >
    {todo.text}
  </li>

export default Todo;
