import { createStore, applyMiddleware, compose } from "redux";
import createLogger from "redux-logger";
import thunk from "redux-thunk";

import reducer from "./reducers";

export default function configureStore() {
  const middlewares = [thunk];

  if (process.env.NODE_ENV !== 'production') { //eslint-disable-line
    middlewares.push(createLogger());
  }

  const devTools = window.devToolsExtension
    ? window.devToolsExtension()
    : (f => f);

  const enhancers = compose(
    applyMiddleware(...middlewares),
    devTools
  );

  const store = createStore(
    reducer,
    /* persistedStateIfYouUseIt, */
    enhancers
  );

  return store;
}

