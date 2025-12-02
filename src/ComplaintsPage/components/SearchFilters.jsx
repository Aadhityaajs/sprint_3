// src/complaints/components/SearchFilters.jsx
import React from 'react';

export default function SearchFilters({
  searchId,
  setSearchId,
  statusFilters,
  toggleStatus,
  userType, // for admin only
  setUserType,
  dateRange,
  setDateRange,
  isAdmin,
  onOpenModal
}) {
  return (
    <div className="flex items-center gap-4 w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex-wrap">
      <div className="relative">
        <input
          className="pl-4 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          placeholder="Search complaint by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
      </div>

      {isAdmin && (
        <>
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
            <input
              type="date"
              className="bg-transparent border-none text-sm text-gray-600 focus:ring-0 px-2 py-1 outline-none"
              value={dateRange.from}
              onChange={(e) => setDateRange((d) => ({ ...d, from: e.target.value }))}
            />
            <span className="text-gray-400 text-sm">to</span>
            <input
              type="date"
              className="bg-transparent border-none text-sm text-gray-600 focus:ring-0 px-2 py-1 outline-none"
              value={dateRange.to}
              onChange={(e) => setDateRange((d) => ({ ...d, to: e.target.value }))}
            />
          </div>
        </>
      )}

      <div className="flex gap-2 items-center">
        {['Active', 'Closed', 'Deleted'].map((k) => (
          <label
            key={k}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all select-none
              ${statusFilters[k]
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-700"
              }`}
          >
            <input
              type="checkbox"
              checked={statusFilters[k]}
              onChange={() => toggleStatus(k)}
              className="w-4 h-4 rounded"
            />
            {k}
          </label>
        ))}
      </div>

      <div className="flex gap-2 ml-auto">
        {isAdmin ? (
          <>
            <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-sm font-medium transition-all select-none
              ${userType === 'ALL' ? 'bg-gray-800 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <input
                type="radio"
                name="userType"
                checked={userType === 'ALL'}
                onChange={() => setUserType('ALL')}
                className="hidden"
              /> All
            </label>
            <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-sm font-medium transition-all select-none
              ${userType === 'CLIENT' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <input
                type="radio"
                name="userType"
                checked={userType === 'CLIENT'}
                onChange={() => setUserType('CLIENT')}
                className="hidden"
              /> Client
            </label>
            <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-sm font-medium transition-all select-none
              ${userType === 'HOST' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <input
                type="radio"
                name="userType"
                checked={userType === 'HOST'}
                onChange={() => setUserType('HOST')}
                className="hidden"
              /> Host
            </label>
          </>
        ) : (
          <div className="flex gap-2 items-center">
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all"
              onClick={onOpenModal}
            >
              Raise Complaint
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
