import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { Router, Route, browserHistory } from "react-router";

import createStore from "./store";
import TodoApp from './TodoApp';
import './index.css';

const store = createStore();

// Components register themselves with the store,
//  so we don't need a global render method.
ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/(:filter)" component={TodoApp} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
