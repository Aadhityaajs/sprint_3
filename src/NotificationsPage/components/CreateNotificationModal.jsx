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
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Create Notification</h3>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            className="form-control"
                            value={form.title || ''}
                            onChange={handleChange}
                            placeholder="Notification Title"
                        />
                        {errors.title && <span className="error">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label>Target</label>
                        <select
                            name="target"
                            className="form-control"
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
                        <div className="form-group">
                            <label>User IDs (comma separated)</label>
                            <input
                                type="text"
                                name="targetUsersInput"
                                className="form-control"
                                value={form.targetUsersInput || ''}
                                onChange={handleChange}
                                placeholder="e.g. 1, 2, 3"
                            />
                        </div>
                    )} */}

                    <div className="form-group">
                        <label>Type</label>
                        <select
                            name="type"
                            className="form-control"
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

                    <div className="form-group">
                        <label>Message</label>
                        <textarea
                            name="message"
                            className="form-control"
                            rows={4}
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Enter notification message..."
                        />
                        {errors.message && <span className="error">{errors.message}</span>}
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
