// src/complaints/components/SummaryCards.jsx
import React from 'react';

export default function SummaryCards({ summary }) {
  return (
    <div className="flex gap-4 w-1/2 h-[100px] min-w-[600px]">
      <div className="bg-white p-5 rounded-xl flex-1 flex items-center justify-between shadow-sm">
        <div className="font-extrabold text-[42px] leading-none text-center">{summary.total}</div>
        <div className="text-2xl text-gray-500 text-center font-semibold">Total</div>
      </div>
      <div className="bg-white p-5 rounded-xl flex-1 flex items-center justify-between shadow-sm">
        <div className="font-extrabold text-[42px] leading-none text-center">{summary.active}</div>
        <div className="text-2xl text-gray-500 text-center font-semibold">Unread</div>
      </div>
      <div className="bg-white p-5 rounded-xl flex-1 flex items-center justify-between shadow-sm">
        <div className="font-extrabold text-[42px] leading-none text-center">{summary.resolved}</div>
        <div className="text-2xl text-gray-500 text-center font-semibold">Read</div>
      </div>
    </div>
  );
}