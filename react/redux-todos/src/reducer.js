import { combineReducers } from "redux";

// It's idiomatic to use shorthand here, but I find the reducer names
//  clash with useful variable names so I prefer reduceTodos or todosReducer.
export default combineReducers({
  todos: reduceTodos,
  visibility: reduceVisibility
});

// Reducer for an array of Todos
// State: Todo[]
function reduceTodos(state = [], action) {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, reduceTodo(null, action)];
    case "TOGGLE_TODO":
      return state.map(todo => reduceTodo(todo, action));
    default:
      return state;
  }
}

// Reducer for a single Todo
// State: Todo
function reduceTodo(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return newTodo(action);
    case "TOGGLE_TODO":
      return (action.id === state.id)
        ? toggleTodo(state)
        : state;
    default:
      return state;
  }
}

function reduceVisibility(state = "SHOW_ALL", action) {
  switch(action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
  }
}

function newTodo({ id, text }) {
  return { id, text, completed: false };
}

function toggleTodo(todo) {
  return { ...todo, completed: !todo.completed };
}
