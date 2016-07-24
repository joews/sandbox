import React from "react";
import "./TodoFilterToggle.css"

export default function TodoFilterToggle({ store, children, visibility, activeVisibility }) {
  if (visibility === activeVisibility) {
    return <span className="TodoFilterToggle TodoFilterToggle--active">
      {children}
    </span>
  } else {
    return <a href="#" className="TodoFilterToggle"
      onClick={() => {
        store.dispatch({
          filter: visibility,
          type: "SET_VISIBILITY_FILTER"
        });
      }}
    >
      {children}
    </a>;
  }
}
