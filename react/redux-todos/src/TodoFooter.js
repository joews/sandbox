import React from "react";

import FilterLink from "./FilterLink";
import "./TodoFooter.css"

// Presentational component - redux-agnostic
const TodoFooter = () => {
  const links = [
    ["All", "all"],
    ["Complete", "complete"],
    ["Active", "active"]
  ];

  return (
    <footer className="TodoFooter">
      <label>Show: </label>
      {links.map(([label, key]) =>
        <FilterLink key={key} filter={key}>{label}</FilterLink>
      )}
    </footer>
  );
}

export default TodoFooter;
