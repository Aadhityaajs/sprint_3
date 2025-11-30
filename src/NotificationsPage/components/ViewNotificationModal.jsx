import React from 'react';
export default function ViewNotificationModal({ notification, onClose }) {
    if (!notification) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-800">{notification.notificationTitle}</h2>
                    <button
                        className="text-black hover:text-black-600 transition-colors text-2xl leading-none cursor-pointer"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                            ${notification.notificationType === 'info' ? 'bg-blue-100 text-blue-700' :
                                notification.notificationType === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'}`}>
                            {notification.notificationType}
                        </span>
                        <span className="text-xs text-gray-500">
                            {new Date(notification.notificationCreatedOn).toLocaleString()}
                        </span>
                    </div>
                    <div className="text-gray-600 text-sm leading-relaxed mb-6">
                        <p>{notification.notificationMessage}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                        <small className="text-gray-400 text-xs uppercase tracking-wide font-medium">From: Admin</small>
                    </div>
                </div>
            </div>
        </div>
    );
}
