import { v4 as uuid } from "node-uuid";

import { getIsFetching } from "../reducers";
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

  // The returned function can dispatch zero or more actions.
  // If it returns a promise, components can respond to the
  //  sequence finishing or failing.
  (dispatch, getState) => {
    const isFetching = getIsFetching(getState(), filter);
    if (isFetching) {
      return Promise.resolve();
    }

    dispatch({
      type: "FETCH_TODOS_REQUEST",
      filter
    });

    return api.fetchTodos(filter)
      .then(
        response =>
          dispatch({
            type: "FETCH_TODOS_SUCCESS",
            filter,
            response
          }),
        err =>
          dispatch({
            type: "FETCH_TODOS_FAILURE",
            filter,
            message: err.message || "Something went wrong!"
          })
      );
  }
