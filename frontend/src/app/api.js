import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: '/', // Use base URL as requests will be proxied or relative
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers['Authorization'] = 'Bearer ' + user.token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        
        if (error.response?.status === 401) {
            toast.error('Session expired. Please login again.');
            localStorage.removeItem('user');
            // We could trigger a redirect to login here if we had access to history or a global state action
        } else {
            toast.error(message);
        }
        
        return Promise.reject(error);
    }
);

export default api;
