import type { User, LoginCredentials } from '@/types';

const MOCK_USERS: User[] = [
    { id: 'u-1', name: 'John Doe', email: 'john@example.com', role: 'APPLICANT', avatarUrl: 'https://github.com/shadcn.png' },
    { id: 'u-2', name: 'Alice Smith', email: 'officer@apex.com', role: 'OFFICER', avatarUrl: '' },
    { id: 'u-3', name: 'Bob Jones', email: 'manager@apex.com', role: 'MANAGER', avatarUrl: '' },
];

export const authService = {
    login: async (credentials: LoginCredentials): Promise<User> => {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = MOCK_USERS.find(u => u.email === credentials.email);
                // For demo, accept any password
                if (user) {
                    resolve(user);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 800);
        });
    },

    logout: async (): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, 500));
    },

    getCurrentUser: (): User | null => {
        return JSON.parse(localStorage.getItem('apex_user') || 'null');
    }
};
