// src/complaints/components/SummaryCards.jsx
import React from 'react';

export default function SummaryCards({ summary }) {
  return (
    <div className="flex gap-4 w-full">
      <div className="bg-white p-6 rounded-xl flex-1 flex flex-col items-center justify-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="font-extrabold text-[42px] leading-none text-center">{summary.total}</div>
        <div className="text-2xl text-gray-500 text-center font-semibold">Total</div>
      </div>
      <div className="bg-white p-6 rounded-xl flex-1 flex flex-col items-center justify-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="font-extrabold text-[42px] leading-none text-center">{summary.active}</div>
        <div className="text-2xl text-gray-500 text-center font-semibold">Unread</div>
      </div>
      <div className="bg-white p-6 rounded-xl flex-1 flex flex-col items-center justify-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="font-extrabold text-[42px] leading-none text-center">{summary.resolved}</div>
        <div className="text-2xl text-gray-500 text-center font-semibold">Read</div>
      </div>
    </div>
  );
}