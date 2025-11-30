// src/notifications/components/CreateNotificationModal.jsx
import React from 'react';
import { NOTIFICATION_TYPES } from '../data';

export default function CreateNotificationModal({
    form,
    setForm,
    errors,
    onSubmit,
    onClose
}) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">Create Notification</h3>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={form.title || ''}
                            onChange={handleChange}
                            placeholder="Notification Title"
                        />
                        {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Target</label>
                        <select
                            name="target"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            value={form.target || 'All Users'}
                            onChange={handleChange}
                        >
                            <option value="All Users">All Users</option>
                            <option value="Clients">Clients</option>
                            <option value="Hosts">Hosts</option>
                            {/* <option value="Specific Users">Specific Users</option> */}
                        </select>
                    </div>

                    {/* {form.target === 'Specific Users' && (
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">User IDs (comma separated)</label>
                            <input
                                type="text"
                                name="targetUsersInput"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                value={form.targetUsersInput || ''}
                                onChange={handleChange}
                                placeholder="e.g. 1, 2, 3"
                            />
                        </div>
                    )} */}

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                            name="type"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                            value={form.type}
                            onChange={handleChange}
                        >
                            {NOTIFICATION_TYPES.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            name="message"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                            rows={4}
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Enter notification message..."
                        />
                        {errors.message && <span className="text-red-500 text-xs mt-1">{errors.message}</span>}
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                        >
                            Send Notification
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
