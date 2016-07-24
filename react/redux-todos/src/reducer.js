// Root reducer
export default function reduce(state = {}, action) {
  // Manual reducer composition
  // TODO combineReducers
  return {
    todos: reduceTodos(state.todos, action),
    visibility: reduceVisibility(state.visibility, action)
  }
}

// Reducer for an array of Todos
// State: Todo[]
// Delegates to child reducers
export function reduceTodos(state = [], action) {
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
