// Local persistence - save and restore state from localStorage
const KEY = "todos.state";

export function loadState() {
  try {
    const serializedState = localStorage.getItem(KEY);
    if (serializedState) {
      return JSON.parse(serializedState);
    } else {
      // explicitly return undefined so  the root reduer uses default state
      return undefined;
    }
  } catch (e) {
    console.log("Could not load saved state from localStorage", e);
    return undefined;
  }
}

export function saveState(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(KEY, serializedState);
    return state;
  } catch (e) {
    console.warn("Could not write saved state to localStorage", e);
    return undefined;
  }
}

