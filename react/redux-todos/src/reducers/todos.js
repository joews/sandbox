import { combineReducers } from "redux";
import todo from "./todo";

// State: Todo[]
function byId(state = {}, action) {
  switch (action.type) {
    case "ADD_TODO":
    case "TOGGLE_TODO":
      return {
        ...state,
        [action.id]: todo(state[action.id], action)
      }
    default:
      return state;
  }
}

function allIds(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.id];
    default:
      return state;
  }
}

export default combineReducers({
  byId,
  allIds
});

//
// Selectors
//

function getAllTodos(state) {
  return state.allIds.map(id => state.byId[id]);
}

// getFilteredTodo is a selector: it is tightly coupled to the state
//  structure, so it's best to keep it with the reducer that controls
//  that slice of the state tree. If we split up reducers into several files,
//  it would go with the `todos` reducer.
export function getFilteredTodos(state, filter) {
  const allTodos = getAllTodos(state);

  switch (filter) {
    case "all":
      return allTodos;
    case "complete":
      return allTodos.filter(t => t.completed);
    case "active":
      return allTodos.filter(t => !t.completed);
    default:
      throw new Error(`Unexpected todos filter: ${filter}`);
  }
}
