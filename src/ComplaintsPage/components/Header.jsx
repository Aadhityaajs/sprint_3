// src/complaints/components/Header.jsx
import React from 'react';
import { MoveLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const sessionUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const role = sessionUser ? sessionUser.role : null;
  const handleGoBack = () => {
    if (role === 'client') {
      navigate('/clientDashboard');
    } else if (role === 'host') {
      navigate('/hostDashboard');
    } else if (role === 'admin') {
      navigate('/adminDashboard');
    }
  };
  return (
    <header className="flex gap-4 items-center mb-6">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white border-0 p-2.5 rounded-lg text-sm cursor-pointer w-12 h-8 flex justify-center items-center shadow-sm hover:shadow-md transition-all"
        aria-label="Back"
        onClick={handleGoBack}
      >
        <MoveLeft />
      </button>
      <h1 className="m-0 text-2xl font-bold text-gray-900">Complaints Dashboard</h1>
    </header>
  );
}
