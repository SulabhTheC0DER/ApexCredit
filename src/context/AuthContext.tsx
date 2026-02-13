import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (role: Role) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedUser = authService.getCurrentUser();
                if (storedUser) {
                    setUser(storedUser);
                }
            } catch (error) {
                console.error('Auth initialization failed', error);
            } finally {
                setIsLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (role: Role) => {
        setIsLoading(true);
        try {
            let email = 'john@example.com';
            if (role === 'OFFICER') email = 'officer@apex.com';
            if (role === 'MANAGER') email = 'manager@apex.com';
            // if (role === 'UNDERWRITER') email = 'officer@apex.com';

            const loggedInUser = await authService.login({ email, password: 'password' });
            setUser(loggedInUser);
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await authService.logout();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
