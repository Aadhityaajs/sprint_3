// src/notifications/data.js

export const NOTIFICATION_TYPES = [
  'info',
  'warning',
  'alert'
];

export const INITIAL_NOTIFICATIONS = [
  {
    notificationId: 1,
    userId: 1,
    notificationTitle: 'System Alert',
    message: 'Scheduled maintenance on Nov 30th.',
    notificationType: 'alert',
    target: 'All Users',
    createdBy: 'System',
    createdon: '2025-11-27T10:00:00.000Z',
    isRead: false,
    readOn: '-'
  },
  {
    notificationId: 2,
    userId: 2,
    notificationTitle: 'Booking Update',
    message: 'Your booking #123 has been confirmed.',
    notificationType: 'info',
    target: 'User 2',
    createdBy: 'System',
    createdon: '2025-11-26T14:30:00.000Z',
    isRead: true,
    readOn: '2025-11-26T15:00:00.000Z'
  },
  {
    notificationId: 3,
    userId: 1,
    notificationTitle: 'Payment Received',
    message: 'Payment of $500 received for booking #101.',
    notificationType: 'info',
    target: 'User 1',
    createdBy: 'System',
    createdon: '2025-11-25T09:15:00.000Z',
    isRead: false,
    readOn: '-'
  },
  {
    notificationId: 4,
    userId: 3,
    notificationTitle: 'New Message',
    message: 'You have a new message from Host.',
    notificationType: 'warning',
    target: 'User 3',
    createdBy: 'Host',
    createdon: '2025-11-20T11:20:00.000Z',
    isRead: false,
    readOn: '-'
  }
];
