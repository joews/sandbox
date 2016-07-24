import React from 'react';
import ReactDOM from 'react-dom';

import createStore from "./store";
import reducer from "./reducer";
import TodoList from './TodoList';
import './index.css';

const store = createStore(reducer);

function render() {
  // Manually inject the redux store into the root component.
  ReactDOM.render(
    <TodoList store={store} {...store.getState()} />,
    document.getElementById('root')
  );
}

store.subscribe(render);
render();
