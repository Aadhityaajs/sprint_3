// src/HostPages/Navbar.jsx
import React from "react";

export default function Navbar() {
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const openComplaint = () => {
    window.location.href = "/complaint";
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        <h2 className="m-0 text-xl font-bold text-gray-900">SpaceFinders</h2>
        <div className="text-gray-500 text-sm font-medium">Host Dashboard</div>
      </div>

      <div className="flex gap-3">
        <button className="bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
          🔔 Notification
        </button>
        <button 
          className="bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          onClick={openComplaint}
        >
          📝 Complaint
        </button>
        <button 
          className="bg-red-600 text-white border-none px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}