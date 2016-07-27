import { createStore } from "redux";
import throttle from "lodash/throttle";

import { loadState, saveState } from "./local-storage";
import reducer from "./reducers";

export default function() {
  const initialState = loadState();
  const store = createStore(reducer, initialState);

  store.subscribe(throttle(() => {
    // Save a subset of state to localStorage
    const state = store.getState();
    const stateToSave = { todos: state.todos };

    saveState(stateToSave);
  }, 500));

  return store;
}

