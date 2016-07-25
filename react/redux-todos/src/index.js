import React from 'react';
import ReactDOM from 'react-dom';

import createStore from "./store";
import reducer from "./reducer";
import TodoApp from './TodoApp';
import Provider from './Provider';
import './index.css';

const store = createStore(reducer);

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <TodoApp />
    </Provider>,
    document.getElementById('root')
  );
}

store.subscribe(render);
render();
