// src/notifications/NotificationsDashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import HeaderNotifications from './components/HeaderNotifications.jsx';
import SummaryCards from './components/SummaryCards.jsx';
import SearchFilters from './components/SearchFilters.jsx';
import NotificationsTable from './components/NotificationsTable';
import CreateNotificationModal from './components/CreateNotificationModal';
import ViewNotificationModal from './components/ViewNotificationModal';
import { getAllNotifications, createNotification, markAsRead } from '../Apis/notificationsApi.jsx';

import AdminHeader from './components/AdminHeader.jsx';

export default function NotificationsDashboard(props) {
    const { role = 'CLIENT', userId: propUserId = 1 } = props;
    const isAdmin = role === 'ADMIN';
    const loggedUserId = Number(propUserId);

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchId, setSearchId] = useState('');
    const [statusFilters, setStatusFilters] = useState({
        Unread: true,
        Read: true
    });
    const [typeFilters, setTypeFilters] = useState({
        info: true,
        warning: true,
        alert: true
    });
    const [userType, setUserType] = useState('ALL'); // admin only
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewNotification, setViewNotification] = useState(null);
    const [form, setForm] = useState({
        type: 'info',
        title: '',
        target: 'All Users',
        targetUsersInput: '',
        userId: loggedUserId,
        message: ''
    });
    const [errors, setErrors] = useState({});

    // LOAD notifications from backend
    useEffect(() => {
        let mounted = true;

        getAllNotifications(role, loggedUserId).then((res) => {
            if (!mounted) return;
            setNotifications(res.notifications || []);
            setLoading(false);
        });

        return () => (mounted = false);
    }, [role, loggedUserId]);

    // SUMMARY cards
    const summary = useMemo(() => {
        if (isAdmin) {
            return {
                total: notifications.length,
                active: notifications.filter((c) => !c.isRead).length,
                resolved: notifications.filter((c) => c.isRead).length
            };
        }

        const userRows = notifications.filter(
            (c) => Number(c.userId) === Number(loggedUserId)
        );

        return {
            total: userRows.length,
            active: userRows.filter((c) => !c.isRead).length,
            resolved: userRows.filter((c) => c.isRead).length
        };
    }, [notifications, isAdmin, loggedUserId]);

    // Toggle statuses
    const toggleStatus = (key) =>
        setStatusFilters((s) => ({ ...s, [key]: !s[key] }));

    // Toggle types
    const toggleType = (key) =>
        setTypeFilters((s) => ({ ...s, [key]: !s[key] }));

    // FILTER rows
    const filteredRows = useMemo(() => {
        let rows = [...notifications];

        // user-specific filtering
        if (!isAdmin) {
            rows = rows.filter(
                (r) => Number(r.userId) === Number(loggedUserId)
            );
        }

        // search by notification id
        if (searchId.trim()) {
            const num = Number(searchId);
            if (!isNaN(num)) {
                rows = rows.filter((r) => r.notificationId === num);
            } else {
                return [];
            }
        }

        // Date filtering
        if (isAdmin && (dateRange.from || dateRange.to)) {
            const from = dateRange.from ? new Date(dateRange.from) : null;
            const to = dateRange.to ? new Date(dateRange.to) : null;

            rows = rows.filter((r) => {
                const d = new Date(r.createdon);
                if (from && d < from) return false;

                if (to) {
                    const end = new Date(dateRange.to);
                    end.setHours(23, 59, 59, 999);
                    if (d > end) return false;
                }

                return true;
            });
        }

        // Status filtering
        const allowed = Object.entries(statusFilters)
            .filter(([_, v]) => v)
            .map(([k]) => k);

        rows = rows.filter((r) => {
            if (r.isRead && allowed.includes('Read')) return true;
            if (!r.isRead && allowed.includes('Unread')) return true;
            return false;
        });

        // Type filtering
        const allowedTypes = Object.entries(typeFilters)
            .filter(([_, v]) => v)
            .map(([k]) => k);

        return rows.filter((r) => allowedTypes.includes(r.notificationType));
    }, [notifications, isAdmin, loggedUserId, searchId, userType, dateRange, statusFilters, typeFilters]);

    // VIEW notification
    const handleView = async (notification) => {
        setViewNotification(notification);

        // Mark as read ONLY if user is NOT admin and notification is unread
        if (!isAdmin && !notification.isRead) {
            try {
                const res = await markAsRead(role, loggedUserId, notification.notificationId);
                if (!res.error) {
                    setNotifications((prev) =>
                        prev.map((c) => (c.notificationId === notification.notificationId ? res.notification : c))
                    );
                    // Update the currently viewed notification to reflect read status
                    setViewNotification(res.notification);
                }
            } catch (err) {
                console.error('Mark as read failed', err);
            }
        }
    };

    // Modal handling
    const openModal = () => {
        setForm({
            type: 'info',
            title: '',
            target: 'All Users',
            targetUsersInput: '',
            userId: loggedUserId,
            message: ''
        });
        setErrors({});
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const validateForm = () => {
        const err = {};
        if (!form.message) err.message = 'Message required';
        if (!form.title) err.title = 'Title required';
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    // CREATE notification
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        let targetUsers = null;

        // Expand target to actual user IDs
        if (form.target === 'All Users') {
            targetUsers = [1, 2, 3]; // All users
        } else if (form.target === 'Clients') {
            targetUsers = [1]; // Client user IDs
        } else if (form.target === 'Hosts') {
            targetUsers = [2]; // Host user IDs
        } else if (form.target === 'Specific Users' && form.targetUsersInput) {
            targetUsers = form.targetUsersInput.split(',').map(s => s.trim()).filter(Boolean);
        }

        try {
            const res = await createNotification(role, loggedUserId, {
                type: form.type,
                title: form.title,
                message: form.message,
                target: form.target,
                targetUsers: targetUsers
            });

            if (res.notifications) {
                setNotifications((prev) => [...res.notifications, ...prev]);
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error('Add failed', err);
        }
    };


    return (
        <div className="p-5 max-w-full mx-auto">
            <HeaderNotifications />

            <main className="bg-transparent">
                <div className="flex gap-4 mb-4 items-start">
                    {isAdmin ? (
                        <AdminHeader
                            summary={summary}
                            searchId={searchId}
                            setSearchId={setSearchId}
                            statusFilters={statusFilters}
                            toggleStatus={toggleStatus}
                            typeFilters={typeFilters}
                            toggleType={toggleType}
                            userType={userType}
                            setUserType={setUserType}
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                            onOpenModal={openModal}
                        />
                    ) : (
                        <>
                            <SummaryCards summary={summary} />
                            <SearchFilters
                                searchId={searchId}
                                setSearchId={setSearchId}
                                statusFilters={statusFilters}
                                toggleStatus={toggleStatus}
                                typeFilters={typeFilters}
                                toggleType={toggleType}
                                userType={userType}
                                setUserType={setUserType}
                                dateRange={dateRange}
                                setDateRange={setDateRange}
                                isAdmin={false}
                                onOpenModal={openModal}
                            />
                        </>
                    )}
                </div>

                {loading ? (
                    <div className="p-6">Loading notifications…</div>
                ) : (
                    <NotificationsTable
                        rows={filteredRows}
                        onView={handleView}
                        isAdmin={isAdmin}
                    />
                )}
            </main>

            {isModalOpen && (
                <CreateNotificationModal
                    form={form}
                    setForm={setForm}
                    errors={errors}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                />
            )}

            {viewNotification && (
                <ViewNotificationModal
                    notification={viewNotification}
                    onClose={() => setViewNotification(null)}
                />
            )}
        </div>
    );
}
