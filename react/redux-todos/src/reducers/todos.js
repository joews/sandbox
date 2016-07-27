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

// factory for a reducer that manages an array of todoIds
//  that match te given filter.
function createList(filter) {
  return (state = [], action) => {
    if (action.filter !== filter) {
      return state;
    }

    switch (action.type) {
      case "RECEIVE_TODOS":
        return action.response.map(t => t.id);
      default:
        return state;
    }
  }
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
  const ids = state.idsByFilter[filter];
  return ids.map(id => state.byId[id]);
}

export function getTodo(state, id) {
  return state.byId[id];
}
