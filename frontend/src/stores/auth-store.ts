import { create } from 'zustand';
import { api } from '@/lib/api';
import { User, LoginData, RegisterData, TokenResponse } from '@/types';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,

    login: async (data: LoginData) => {
        set({ isLoading: true });
        try {
            // Convert to form data for OAuth2
            const formData = new FormData();
            formData.append('username', data.username);
            formData.append('password', data.password);

            const response = await api.post<TokenResponse>('/api/auth/login', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            localStorage.setItem('access_token', response.data.access_token);

            // Fetch user data
            const userResponse = await api.get<User>('/api/auth/me');
            set({ user: userResponse.data, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
            await api.post<User>('/api/auth/register', data);

            // Auto login after registration
            await useAuthStore.getState().login({
                username: data.email,
                password: data.password,
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, isAuthenticated: false });
        // Force page reload to clear all state
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    },

    fetchUser: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
        }

        try {
            const response = await api.get<User>('/api/auth/me');
            set({ user: response.data, isAuthenticated: true });
        } catch (error) {
            localStorage.removeItem('access_token');
            set({ user: null, isAuthenticated: false });
        }
    },
}));
