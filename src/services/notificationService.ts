import type { Notification } from '@/types';

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-1',
        userId: 'app-1',
        title: 'Loan Application Received',
        message: 'Your application #loan-101 has been successfully submitted.',
        read: false,
        type: 'INFO',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'notif-2',
        userId: 'off-1',
        title: 'New Assignment',
        message: 'You have been assigned a new application for review.',
        read: true,
        type: 'WARNING',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
];

export const notificationService = {
    getNotifications: async (userId: string): Promise<Notification[]> => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return MOCK_NOTIFICATIONS.filter(n => n.userId === userId); // Naive filter
    },

    markAsRead: async (id: string): Promise<void> => {
        // In a real app, update state/backend
        console.log(`Notification ${id} marked as read`);
    }
};
