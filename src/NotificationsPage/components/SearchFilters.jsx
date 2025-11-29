// src/complaints/components/SearchFilters.jsx
import React from 'react';

export default function SearchFilters({
  searchId,
  setSearchId,
  statusFilters,
  toggleStatus,
  typeFilters,
  toggleType,
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
          placeholder="Search notification by ID"
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
        {['Unread', 'Read'].map((k) => (
          <label key={k} className={`inline-flex items-center gap-1.5 p-1.5 rounded-md cursor-pointer mr-2 ${statusFilters[k] ? 'bg-blue-100' : ''}`}>
            <input type="checkbox" checked={statusFilters[k]} onChange={() => toggleStatus(k)} />
            {k}
          </label>
        ))}
      </div>

      {typeFilters && (
        <div className="flex gap-1.5 items-center flex-nowrap mt-2">
          <span className="mr-2 font-bold">Type:</span>
          {['info', 'warning', 'alert'].map((k) => (
            <label key={k} className={`inline-flex items-center gap-1.5 p-1.5 rounded-md cursor-pointer mr-2 ${typeFilters[k] ? 'bg-blue-100' : ''}`}>
              <input type="checkbox" checked={typeFilters[k]} onChange={() => toggleType(k)} />
              {k}
            </label>
          ))}
        </div>
      )}

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
            {/* Users cannot create notifications */}
          </div>
        )}
      </div>
    </div>
  );
}
