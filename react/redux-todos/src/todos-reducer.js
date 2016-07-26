// Reducer for an array of Todos

// State: Todo[]
export default function reduceTodos(state = [], action) {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, reduceTodo(null, action)];
    case "TOGGLE_TODO":
      return state.map(todo => reduceTodo(todo, action));
    default:
      return state;
  }
}

//
// Child reducers
//

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

//
// Helpers
//

function newTodo({ id, text }) {
  return { id, text, completed: false };
}

function toggleTodo(todo) {
  return { ...todo, completed: !todo.completed };
}

//
// Selectors
//

// getFilteredTodo is a selector: it is tightly coupled to the state
//  structure, so it's best to keep it with the reducer that controls
//  that slice of the state tree. If we split up reducers into several files,
//  it would go with the `todos` reducer.
export function getFilteredTodos(state, filter) {
  switch (filter) {
    case "all":
      return state;
    case "complete":
      return state.filter(todo => todo.completed);
    case "active":
      return state.filter(todo => !todo.completed);
    default:
      throw new Error(`Unexpected todos filter: ${filter}`);
  }
}
