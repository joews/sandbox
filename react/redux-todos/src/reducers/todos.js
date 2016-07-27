import { combineReducers } from "redux";

// State: Todo[]
function byId(state = {}, action) {
  switch (action.type) {
    case "RECEIVE_TODOS":
      // mutating a shallow clone of state is fine inside
      //  a reducer, since the function stays pure.
      const nextState = { ...state };
      action.response.forEach(t => {
        nextState[t.id] = t;
      })

      return nextState;
    default:
      return state;
  }
}

function allIds(state = [], action) {
  if (action.filter !== "all") {
    return state;
  }

  switch (action.type) {
    case "RECEIVE_TODOS":
      return action.response.map(t => t.id);
    default:
      return state;
  }
}

function activeIds(state = [], action) {
  if (action.filter !== "active") {
    return state;
  }

  switch (action.type) {
    case "RECEIVE_TODOS":
      return action.response.map(t => t.id);
    default:
      return state;
  }
}

function completedIds(state = [], action) {
  if (action.filter !== "complete") {
    return state;
  }

  switch (action.type) {
    case "RECEIVE_TODOS":
      return action.response.map(t => t.id);
    default:
      return state;
  }
}

const idsByFilter = combineReducers({
  all: allIds,
  active: activeIds,
  complete: completedIds
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
  const ids = state.idsByFilter[filter];
  return ids.map(id => state.byId[id]);
}
