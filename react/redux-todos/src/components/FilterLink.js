import React from "react";
import { Link } from "react-router";

import "./FilterLink.css";

// Container component: redux-aware. Gets store from context.
// Making this a container means that we don't need to pass down props
//  through the parent hierarchy. This is better encapsulation because
//  it means that parent components don't need to know which props their
//  descendents need.
export default function FilterLink({ children, filter }) {
  return (
    <Link
      to={filter === 'all' ? '/' : filter}
      className="FilterLink"
      activeClassName="FilterLink--active"
    >
      {children}
    </Link>
  );
}
