import React from "react";
import "./Snackbar.css";

export default function Snackbar({ message, show }) {
  return (
    <div className={`snackbar ${show ? "show" : ""}`}>
      {message}
    </div>
  );
}
