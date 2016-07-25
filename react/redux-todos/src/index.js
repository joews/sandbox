import React from 'react';
import ReactDOM from 'react-dom';

import createStore from "./store";
import reducer from "./reducer";
import TodoApp from './TodoApp';
import Provider from './Provider';
import './index.css';

const store = createStore(reducer);

// Components register themselves with the store,
//  so we don't need a global render method.
ReactDOM.render(
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);
