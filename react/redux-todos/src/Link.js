import React from "react";
import "./Link.css"

// Presentational component - redux-agnostic
export default function Link({ children, active, onClick }) {
  if (active) {
    return <span className="Link Link--active">
      {children}
    </span>
  } else {
    return <a href="#" className="Link" onClick={onClick}>
      {children}
    </a>;
  }
}
