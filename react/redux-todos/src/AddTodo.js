import React from "react";
import "./AddTodo.css";

// Presentational component - redux-agnostic
const AddTodo = ({ onClickAdd }) => {
  // use closure for refs in stateless components
  let input;

  return (
    <div className="AddTodo">
      <input ref={node => { input = node; }} />

      <button onClick={() => {
        onClickAdd(input.value);
        input.value = "";
      }}>
        Add
      </button>
    </div>
  );
}

export default AddTodo;
