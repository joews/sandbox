import React from "react";
import { connect } from "react-redux";

import { addTodo } from "../actions";
import "./AddTodo.css";

// Mixed container and presentation component
// Logic is so simple there isn't really a sensible division of effort.
// Blending is pragmatic.
const AddTodo = ({ dispatch }) => {
  // use closure for refs in stateless components
  let input;

  return (
    <div className="AddTodo">
      <input ref={node => { input = node; }} />

      <button onClick={() => {
        dispatch(addTodo(input.value));
        input.value = "";
      }}>
        Add
      </button>
    </div>
  );
}

// This component does not need state, so mapDispatchToProps is null.
// This component is really simple, so we can inject `dispatch`
//  directly. The component can manage its own calls to dispatch.
// This means the component doesn't have to access context directly.
// const wrap = connect(() => ({ }), (dispatch) => ({ dispatch }));

// This pattern is common, so it's the default:
const wrap = connect();

export default wrap(AddTodo);
