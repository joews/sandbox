import { normalize } from "normalizr";

import * as schema from "../api/schema" ;
import { getIsFetching } from "../reducers";
import * as api from '../api';

// Extracting action creators documents all of the actions
//  in (this part of) the application.

export const addTodo = (text) => (dispatch) =>
  // TODO add some features
  // - dispatch ADD_TODO_REQUEST. A Component can use this
  //   to display a "pending" todo (maybe grey text). We can
  //   change that to black for success, or remove + display error
  //   for failure.
  // - Retry tries to add the same todo.
  api.addTodo(text)
    .then(
      response =>
        dispatch({
          type: "ADD_TODO_SUCCESS",
          response: normalize(response, schema.todo)
        }),
      err =>
        dispatch({
          type: "ADD_TODO_FAILURE",
          message: err.message || "oops "
        })
    );


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
            response: normalize(response, schema.arrayOfTodos)
          }),
        err =>
          dispatch({
            type: "FETCH_TODOS_FAILURE",
            filter,
            message: err.message || "Something went wrong!"
          })
      );
  }
