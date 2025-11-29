// src/complaints/components/ComplaintsTable.jsx
import React from 'react';

export default function ComplaintsTable({ rows, onResolve, onDelete, isAdmin }) {
  return (
    <div className="overflow-auto bg-white rounded-lg p-2.5 mt-6">
      <table className="w-full border-collapse table-fixed">
        <thead>
          <tr>
            <th className="bg-gray-50 font-semibold p-2 border-b border-gray-100 text-left text-sm w-[60px]">ID</th>
            <th className="bg-gray-50 font-semibold p-2 border-b border-gray-100 text-left text-sm w-[120px]">Booking Id</th>
            <th className="bg-gray-50 font-semibold p-2 border-b border-gray-100 text-left text-sm w-[140px]">Created On</th>
            <th className="bg-gray-50 font-semibold p-2 border-b border-gray-100 text-left text-sm w-[100px]">Status</th>
            <th className="bg-gray-50 font-semibold p-2 border-b border-gray-100 text-left text-sm w-[160px]">Resolution On</th>
            <th className="bg-gray-50 font-semibold p-2 border-b border-gray-100 text-left text-sm w-[400px]">Description</th>
            <th className="bg-gray-50 font-semibold p-2 border-b border-gray-100 text-left text-sm w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={row.status === 'Deleted' ? 'opacity-50' : ''}>
              <td className="p-2 border-b border-gray-100 text-left text-sm">{row.id}</td>
              <td className="p-2 border-b border-gray-100 text-left text-sm">{row.bookingId}</td>
              <td className="p-2 border-b border-gray-100 text-left text-sm">{row.createdOn}</td>
              <td className="p-2 border-b border-gray-100 text-left text-sm">{row.status}</td>
              <td className="p-2 border-b border-gray-100 text-left text-sm">{row.resolutionOn === '-' ? '' : row.resolutionOn}</td>
              <td className="p-2 border-b border-gray-100 text-left text-sm max-w-[360px] whitespace-nowrap overflow-hidden text-ellipsis">{row.description}</td>
              <td className="p-2 border-b border-gray-100 text-left text-sm">
                {isAdmin ? (
                  <button
                    disabled={row.status !== 'Active'}
                    onClick={() => onResolve(row.id)}
                    className={`p-1.5 px-2.5 rounded-md text-sm cursor-pointer ${row.status === 'Active'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-transparent text-gray-500 border border-gray-200 cursor-not-allowed opacity-50'
                      }`}
                  >
                    Resolve
                  </button>
                ) : (
                  <button
                    disabled={row.status !== 'Active'}
                    onClick={() => onDelete(row.id)}
                    className="bg-transparent border border-red-600 text-red-600 p-1.5 rounded-md cursor-pointer hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center p-6 text-gray-500">No complaints to show</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
