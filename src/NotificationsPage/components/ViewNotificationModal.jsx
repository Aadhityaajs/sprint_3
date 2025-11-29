import React from 'react';
export default function ViewNotificationModal({ notification, onClose }) {
    if (!notification) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{notification.notificationTitle}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <div className="meta-info">
                        <span className={`badge type-${notification.notificationType}`}>
                            {notification.notificationType}
                        </span>
                        <span className="date">
                            {new Date(notification.createdon).toLocaleString()}
                        </span>
                    </div>
                    <div className="message-content">
                        <p>{notification.message}</p>
                    </div>
                    <div className="footer-info">
                        <small>From: {notification.createdBy}</small>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
