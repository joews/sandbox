import { combineReducers } from "redux";

import reduceTodos, * as todos from "./todos";

// It's idiomatic to use shorthand here, but I find the reducer names
//  clash with useful variable names so I prefer reduceTodos or todosReducer.
export default combineReducers({
  todos: reduceTodos
});

//
// Selectors
//

// Map the global state into the selected todos state.
// This two-layer selector means that child selectors and consumers
//  don't need to understand the state shape.
export function getFilteredTodos(state, filter) {
  return todos.getFilteredTodos(state.todos, filter);
}
