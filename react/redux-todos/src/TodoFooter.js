import React from "react";

import FilterLink from "./FilterLink";
import "./TodoFooter.css"

// Presentational component - redux-agnostic
const TodoFooter = () => {
  const links = [
    ["All", "SHOW_ALL"],
    ["Complete", "SHOW_COMPLETE"],
    ["Incomplete", "SHOW_INCOMPLETE"]
  ];

  return (
    <footer className="TodoFooter">
      <label>Show: </label>
      {links.map(([label, key]) =>
        <FilterLink key={key} visibility={key}>{label}</FilterLink>
      )}
    </footer>
  );
}

export default TodoFooter;
