import { createStore, applyMiddleware } from "redux";
import createLogger from "redux-logger";

import reducer from "./reducers";

// diy redux-thunk
const thunk = (store) => (next) => (action) =>
  typeof action === "function"
    ? action(store.dispatch)
    : next(action);

export default function configureStore() {
  const middlewares = [thunk];

  if (process.env.NODE_ENV !== 'production') { //eslint-disable-line
    middlewares.push(createLogger());
  }

  const store = createStore(
    reducer,
    /* persistedStateIfYouUseIt, */
    applyMiddleware(...middlewares)
  );

  return store;
}

