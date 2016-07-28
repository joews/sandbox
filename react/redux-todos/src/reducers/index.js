import { combineReducers } from "redux";

// State: Todo[]
function byId(state = {}, action) {
  if (action.response) {
    return {
      ...state,
      ...action.response.entities.todos
    }
  }

  return state;
}

// factory for a reducer that manages an array of todoIds
//  that match te given filter.

// TODO extract to a new module
function createList(filter) {
  const ids = (state = [], action) => {
    switch (action.type) {
      case "FETCH_TODOS_SUCCESS":
        return (filter === action.filter)
          ? action.response.result
          : state;
      case "ADD_TODO_SUCCESS":
        return (filter !== "complete")
          ? [...state, action.response.result]
          : state;
      case "TOGGLE_TODO_SUCCESS":
        return handleToggle(state, action)
      default:
        return state;
    }
  }

  function handleToggle(state, action) {
    const { result: toggledId, entities } = action.response;
    const { completed } = entities.todos[toggledId];

    const shouldRemove =
      (completed && filter === "active") ||
      (!completed && filter === "complete");

    return shouldRemove
      ? state.filter(id => id !== toggledId)
      : state;
  }

  const isFetching = (state = false, action) => {
    if (action.filter !== filter) {
      return state;
    }

    switch (action.type) {
      case "FETCH_TODOS_REQUEST":
        return true;
      case "FETCH_TODOS_SUCCESS":
      case "FETCH_TODOS_FAILURE":
        return false;
      default:
        return state;
    }
  }

  const errorMessage = (state = null, action) => {
    if (action.filter !== filter) {
      return state;
    }

    switch (action.type) {
      case "FETCH_TODOS_FAILURE":
        return action.message;
      case "FETCH_TODOS_SUCCESS":
      case "FETCH_TODOS_REQUEST":
        return null;
      default:
        return state;
    }
  }

  return combineReducers({
    ids,
    isFetching,
    errorMessage
  })
}

const idsByFilter = combineReducers({
  all: createList("all"),
  active: createList("active"),
  complete: createList("complete")
})

export default combineReducers({
  byId,
  idsByFilter
});

//
// Selectors
//

// getFilteredTodo is a selector: it is tightly coupled to the state
//  structure, so it's best to keep it with the reducer that controls
//  that slice of the state tree. If we split up reducers into several files,
//  it would go with the `todos` reducer.
export function getFilteredTodos(state, filter) {
  const { ids } = state.idsByFilter[filter];
  return ids.map(id => state.byId[id]);
}

export function getTodo(state, id) {
  return state.byId[id];
}

// TODO we could extract createList into a separate file and delegate
//  access to a selector in there. That would mean the state shape is fully
//  encapsulated for that slice of the tree, rather than reaching in
//  like this.
export function getIsFetching(state, filter) {
  return state.idsByFilter[filter].isFetching;
}

export function getErrorMessage(state, filter) {
  return state.idsByFilter[filter].errorMessage;
}
