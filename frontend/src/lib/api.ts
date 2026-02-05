import axios from 'axios';

// Runtime API URL detection - works in both local and production
const getApiUrl = () => {
    // Check if we're in browser
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;

        // If on Railway production frontend
        if (hostname.includes('railway.app')) {
            return 'https://achievement-production.up.railway.app';
        }
    }

    // Fallback to env var or localhost
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
};

const API_URL = getApiUrl();
console.log('API_URL configured as:', API_URL);

// Create axios instance
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        console.log("API Request:", config.url, "Token present:", !!token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
