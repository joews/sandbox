// FIXME
// * state?
// * mock API layer?
let nextTodoId = 1;

// Extracting action creators documents all of the actions
//  in (this part of) the application.

export function addTodo(text) {
  return {
    type: "ADD_TODO",
    id: nextTodoId ++,
    text
  };
}

export function setVisibilityFilter(visibility) {
  return {
    type: "SET_VISIBILITY_FILTER",
    filter: visibility
  };
}

export function toggleTodo(id) {
  return { type: "TOGGLE_TODO", id };
}
