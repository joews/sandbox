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

export function fetchTodos(filter) {
  return api.fetchTodos(filter)
    .then(response =>
      receiveTodos(filter, response)
    );
}

export function receiveTodos(filter, response) {
  return {
    type: "RECEIVE_TODOS",
    filter,
    response
  }
}
