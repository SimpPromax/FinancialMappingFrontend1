import axios from 'axios';

// Define the server base URL
// You can change this value to update the server address for the entire application
const SERVER_URL = 'http://192.168.100.118:8080';

// Create an axios instance with the base URL
const api = axios.create({
    baseURL: SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor (optional, but good for debugging or adding tokens later)
api.interceptors.request.use(
    (config) => {
        // You can add auth tokens here if needed
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor (optional, for global error handling)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle global errors like 401 Unauthorized here
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default api;
