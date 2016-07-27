import { v4 as uuid } from "node-uuid";

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
