import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function HeaderNotifications() {
  const navigate = useNavigate();

  const handleBack = () => {
    const sessionUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const role = sessionUser ? sessionUser.role : null;

    if (role === "client") {
      navigate("/clientDashboard");
    } else if (role === "host") {
      navigate("/hostDashboard");
    } else if (role === "admin") {
      navigate("/adminDashboard");
    } else {
      navigate("/"); // fallback if no role found
    }
  };

  return (
    <header className="flex gap-4 items-center mb-6">
      <button
        onClick={handleBack}
        className="bg-blue-600 hover:bg-blue-700 text-white border-0 p-2.5 rounded-lg text-sm cursor-pointer w-12 h-8 flex justify-center items-center shadow-sm hover:shadow-md transition-all"
        aria-label="Back"
      >
        <FiArrowLeft />
      </button>

       <h1 className="m-0 text-2xl font-bold text-gray-900">Notifications Dashboard</h1>
    </header>
  );
}
