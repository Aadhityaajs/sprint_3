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
    <header className="flex gap-3 items-center mb-5">
      <button
        onClick={handleBack}
        className="bg-blue-600 text-white border-0 p-2 rounded-md text-sm cursor-pointer 
                   w-[50px] flex justify-center items-center hover:bg-blue-700"
        aria-label="Back"
      >
        <FiArrowLeft />
      </button>

      <h1 className="m-0 text-lg font-bold">Notifications Dashboard</h1>
    </header>
  );
}
