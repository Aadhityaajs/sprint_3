// src/notifications/components/NotificationsTable.jsx
import React from 'react';

export default function NotificationsTable({ rows, onView, isAdmin }) {
    if (!rows || rows.length === 0) {
        return <div className="no-data">No notifications found.</div>;
    }

    return (
        <div className="overflow-auto bg-white rounded-lg p-2.5 mt-6">
            <table className="w-full border-collapse table-fixed">
                <thead>
                    <tr>
                        <th className="bg-gray-50 font-semibold p-2 border-b border-gray-100 text-left text-sm w-[60px]">ID</th>
                        <th className="bg-gray-50 font-semibold p-2 border-b border-gray-100 text-left text-sm w-[80px]">User ID</th>
                        <th className="bg-gray-50 font-semibold p-2 border-b border-gray-100 text-left text-sm w-[100px]">Type</th>
                        <th className="bg-gray-50 font-semibold p-2 border-b border-gray-100 text-left text-sm w-[250px]">Title</th>
                        <th className="bg-gray-50 font-semibold p-2 border-b border-gray-100 text-left text-sm w-[140px]">Created On</th>
                        <th className="bg-gray-50 font-semibold p-2 border-b border-gray-100 text-left text-sm w-[100px]">Status</th>
                        <th className="bg-gray-50 font-semibold p-2 border-b border-gray-100 text-left text-sm w-[140px]">Read On</th>
                        <th className="bg-gray-50 font-semibold p-2 border-b border-gray-100 text-left text-sm w-[100px]">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.notificationId}>
                            <td className="p-2 border-b border-gray-100 text-left text-sm">{row.notificationId}</td>
                            <td className="p-2 border-b border-gray-100 text-left text-sm">{row.userId}</td>
                            <td className="p-2 border-b border-gray-100 text-left text-sm">
                                <span className="px-3 py-1 rounded-md text-xs font-semibold capitalize bg-blue-50 text-blue-600">{row.notificationType}</span>
                            </td>
                            <td className="p-2 border-b border-gray-100 text-left text-sm">{row.notificationTitle}</td>
                            <td className="p-2 border-b border-gray-100 text-left text-sm">
                                {new Date(row.notificationCreatedOn).toLocaleDateString()}
                            </td>
                            <td className="p-2 border-b border-gray-100 text-left text-sm">
                                <span className={`px-3 py-1 rounded-md text-xs font-semibold capitalize ${row.notificationIsRead ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                                    {row.notificationIsRead ? 'Read' : 'Unread'}
                                </span>
                            </td>
                            <td className="p-2 border-b border-gray-100 text-left text-sm">
                                {row.notificationReadOn && row.notificationReadOn !== '-'
                                    ? new Date(row.notificationReadOn).toLocaleDateString()
                                    : '-'}
                            </td>
                            <td className="p-2 border-b border-gray-100 text-left text-sm">
                                <div className="flex gap-2">
                                    <button
                                        className="bg-blue-600 text-white border-0 px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer hover:bg-blue-700"
                                        onClick={() => onView(row)}
                                        title="View Details"
                                    >
                                        View
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
