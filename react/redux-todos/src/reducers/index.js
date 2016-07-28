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

// TODO extract to a new module
function createList(filter) {
  const ids = (state = [], action) => {
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

  const isFetching = (state = false, action) => {
    if (action.filter !== filter) {
      return state;
    }

    switch (action.type) {
      case "REQUEST_TODOS":
        return true;
      case "RECEIVE_TODOS":
        return false;
      default:
        return state;
    }
  }

  return combineReducers({
    ids,
    isFetching
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
