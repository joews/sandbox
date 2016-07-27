// Reducer for a single Todo
// State: Todo
export default function reduceTodo(state, action) {
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

function newTodo({ id, text }) {
  return { id, text, completed: false };
}

function toggleTodo(todo) {
  return { ...todo, completed: !todo.completed };
}
