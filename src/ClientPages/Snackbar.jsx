// src/ClientPages/Snackbar.jsx
import React from "react";

export default function Snackbar({ message, show }) {
  return (
    <div
      className={`
        fixed bottom-5 left-1/2 -translate-x-1/2 
        bg-gray-900 text-white 
        px-6 py-3 rounded-lg shadow-lg
        transition-all duration-300 ease-in-out z-50
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      {message}
    </div>
  );
}