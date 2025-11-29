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
    <div className="flex items-center gap-3 mt-6 max-w-[700px]">
      <div className="search">
        <input
          className="px-2.5 py-2 rounded-md border border-gray-500 bg-white text-gray-900 w-60"
          placeholder="Search complaint by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
      </div>

      {isAdmin && (
        <div className="flex gap-2 items-center mt-2">
          <label>
            From
            <input
              type="date"
              className="ml-2.5 h-8 rounded-md border border-gray-500 bg-white text-gray-600 text-center"
              value={dateRange.from}
              onChange={(e) => setDateRange((d) => ({ ...d, from: e.target.value }))}
            />
          </label>
          <label>
            To
            <input
              type="date"
              className="ml-2.5 h-8 rounded-md border border-gray-500 bg-white text-gray-600 text-center"
              value={dateRange.to}
              onChange={(e) => setDateRange((d) => ({ ...d, to: e.target.value }))}
            />
          </label>
        </div>
      )}

      <div className="flex gap-1.5 items-center flex-nowrap mt-2">
        {['Active', 'Closed', 'Deleted'].map((k) => (
          <label key={k} className={`inline-flex items-center gap-1.5 p-1.5 rounded-md cursor-pointer mr-2 ${statusFilters[k] ? 'bg-blue-100' : ''}`}>
            <input type="checkbox" checked={statusFilters[k]} onChange={() => toggleStatus(k)} />
            {k}
          </label>
        ))}
      </div>

      <div className="flex gap-2 ml-2 mt-2">
        {isAdmin ? (
          <>
            <label className="inline-flex items-center gap-1.5 p-1.5 rounded-md cursor-pointer mr-2">
              <input
                type="radio"
                name="userType"
                checked={userType === 'ALL'}
                onChange={() => setUserType('ALL')}
              /> All
            </label>
            <label className={`inline-flex items-center gap-1.5 p-1.5 rounded-md cursor-pointer mr-2 ${userType === 'CLIENT' ? 'bg-blue-100' : ''}`}>
              <input
                type="radio"
                name="userType"
                checked={userType === 'CLIENT'}
                onChange={() => setUserType('CLIENT')}
              /> Client
            </label>
            <label className={`inline-flex items-center gap-1.5 p-1.5 rounded-md cursor-pointer mr-2 ${userType === 'HOST' ? 'bg-blue-100' : ''}`}>
              <input
                type="radio"
                name="userType"
                checked={userType === 'HOST'}
                onChange={() => setUserType('HOST')}
              /> Host
            </label>
          </>
        ) : (
          <div className="flex gap-2 items-center">
            <button className="bg-blue-600 text-white border-0 px-3.5 py-2 rounded cursor-pointer hover:bg-blue-700" onClick={onOpenModal}>Raise Complaint</button>
          </div>
        )}
      </div>
    </div>
  );
}
