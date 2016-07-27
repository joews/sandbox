import { createStore, applyMiddleware } from "redux";
import promise from "redux-promise";
import createLogger from "redux-logger";

import reducer from "./reducers";

export default function configureStore() {
  const middlewares = [promise];

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

