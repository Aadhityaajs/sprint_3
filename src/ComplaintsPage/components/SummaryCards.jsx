// src/complaints/components/SummaryCards.jsx
import React from 'react';

export default function SummaryCards({ summary }) {
  return (
    <div className="flex gap-4 w-full">
      <div className="bg-white p-6 rounded-xl flex-1 flex flex-col items-center justify-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="font-extrabold text-[42px] leading-none text-center text-gray-900">{summary.total}</div>
        <div className="text-lg text-gray-600 text-center font-semibold mt-2">Total</div>
      </div>
      <div className="bg-white p-6 rounded-xl flex-1 flex flex-col items-center justify-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="font-extrabold text-[42px] leading-none text-center text-gray-900">{summary.active}</div>
        <div className="text-lg text-gray-600 text-center font-semibold mt-2">Active</div>
      </div>
      <div className="bg-white p-6 rounded-xl flex-1 flex flex-col items-center justify-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="font-extrabold text-[42px] leading-none text-center text-gray-900">{summary.resolved}</div>
        <div className="text-lg text-gray-600 text-center font-semibold mt-2">Resolved</div>
      </div>
    </div>
  );
}
