// src/complaints/components/ComplaintsTable.jsx
import React from 'react';

export default function ComplaintsTable({ rows, onResolve, onDelete, isAdmin }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr>
              <th className="bg-gray-50 font-semibold px-6 py-3 border-b border-gray-200 text-left text-xs text-gray-700 uppercase w-[60px]">ID</th>
              <th className="bg-gray-50 font-semibold px-6 py-3 border-b border-gray-200 text-left text-xs text-gray-700 uppercase w-[120px]">Booking Id</th>
              <th className="bg-gray-50 font-semibold px-6 py-3 border-b border-gray-200 text-left text-xs text-gray-700 uppercase w-[140px]">Created On</th>
              <th className="bg-gray-50 font-semibold px-6 py-3 border-b border-gray-200 text-left text-xs text-gray-700 uppercase w-[100px]">Status</th>
              <th className="bg-gray-50 font-semibold px-6 py-3 border-b border-gray-200 text-left text-xs text-gray-700 uppercase w-[160px]">Resolution On</th>
              <th className="bg-gray-50 font-semibold px-6 py-3 border-b border-gray-200 text-left text-xs text-gray-700 uppercase w-[400px]">Description</th>
              <th className="bg-gray-50 font-semibold px-6 py-3 border-b border-gray-200 text-left text-xs text-gray-700 uppercase w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row) => (
              <tr key={row.id} className={`hover:bg-gray-50 transition-colors ${row.status === 'Deleted' ? 'opacity-50' : ''}`}>
                <td className="px-6 py-4 text-sm text-gray-900">{row.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.bookingId}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.createdOn}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${row.status === 'Active' ? 'bg-green-100 text-green-700' :
                      row.status === 'Closed' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.resolvedOn || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-[360px] whitespace-nowrap overflow-hidden text-ellipsis">{row.description}</td>
                <td className="px-6 py-4 text-sm">
                  {isAdmin ? (
                    <button
                      disabled={row.status !== 'Active'}
                      onClick={() => onResolve(row.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${row.status === 'Active'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      Resolve
                    </button>
                  ) : (
                    <button
                      disabled={row.status !== 'Active'}
                      onClick={() => onDelete(row.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${row.status === 'Active'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center px-6 py-12 text-gray-500">No complaints to show</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
