import axios from 'axios';

const axiosInstance = axios.create({
  // Replace with your actual .NET API URL
  baseURL: 'https://localhost:7063/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach the Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if we are ALREADY on the login page
    const isLoginPage = window.location.pathname === '/login';

    if (error.response?.status === 401 && !isLoginPage) {
      // ONLY redirect if we aren't already trying to log in
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      //window.location.href = '/login';
    }

    // Always reject the promise so the catch block in Login.tsx can run
    return Promise.reject(error);
  }
);

export default axiosInstance;