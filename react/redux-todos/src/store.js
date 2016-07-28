import { createStore, applyMiddleware } from "redux";
import createLogger from "redux-logger";
import thunk from "redux-thunk";

import reducer from "./reducers";

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

