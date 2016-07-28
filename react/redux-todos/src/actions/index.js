import { v4 as uuid } from "node-uuid";
import * as api from '../api';

// Extracting action creators documents all of the actions
//  in (this part of) the application.

export function addTodo(text) {
  return {
    type: "ADD_TODO",
    id: uuid(),
    text
  };
}

export function toggleTodo(id) {
  return { type: "TOGGLE_TODO", id };
}

// thunk action:
// more powerful than a promise for an asyc action,
// because it works with a chain of many async actions.
export const fetchTodos = (filter) =>
  (dispatch) => {
    dispatch(requestTodos(filter));

    api.fetchTodos(filter)
      .then(response =>
        dispatch(receiveTodos(filter, response))
      );
  }

function requestTodos(filter) {
  return {
    type: "REQUEST_TODOS",
    filter
  }
}

export function receiveTodos(filter, response) {
  return {
    type: "RECEIVE_TODOS",
    filter,
    response
  }
}
