// src/complaints/components/Header.jsx
import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';

export default function HeaderNotifications() {
  return (
    <header className="flex gap-3 items-center mb-5">
      <button className="bg-blue-600 text-white border-0 p-2 rounded-md text-sm cursor-pointer w-[50px] flex justify-center items-center hover:bg-blue-700" aria-label="Back"><FiArrowLeft /></button>
      <h1 className="m-0 text-lg font-bold">Notifications Dashboard</h1>
    </header>
  );
}
