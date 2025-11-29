// src/complaints/components/Header.jsx
import React from 'react';
import { MoveLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="flex gap-3 items-center mb-5">
      <button className="bg-blue-600 text-white border-0 p-2 rounded-md text-sm cursor-pointer w-[50px] flex justify-center items-center hover:bg-blue-700" aria-label="Back" onClick={() => navigate('/clientDashboard')}><MoveLeft /></button>
      <h1 className="m-0 text-lg font-bold">Complaints Dashboard</h1>
    </header>
  );
}
