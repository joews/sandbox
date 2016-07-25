import React from "react";
import "./AddTodo.css";

// FIXME
let nextTodoId = 1;

// Mixed container and presentation component
// Logic is so simple there isn't really a sensible division of effort.
// Blending is pragmatic.
const AddTodo = (props, context) => {
  // use closure for refs in stateless components
  let input;

  return (
    <div className="AddTodo">
      <input ref={node => { input = node; }} />

      <button onClick={() => {
        context.store.dispatch({
          type: "ADD_TODO",
          id: nextTodoId ++,
          text: input.value
        });

        input.value = "";
      }}>
        Add
      </button>
    </div>
  );
}

// Opt-in to context
AddTodo.contextTypes = {
  store: React.PropTypes.object
}


export default AddTodo;
