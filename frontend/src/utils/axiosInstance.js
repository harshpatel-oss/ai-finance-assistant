import axios from 'axios';

import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {  
        'Content-Type': 'application/json'
    }
});

//Request interceptor to add the auth token to headers

axiosInstance.interceptors.request.use(config => {
    const accesstoken = localStorage.getItem('accessToken');
   if (accesstoken) {
       config.headers['Authorization'] = `Bearer ${accesstoken}`;
   }
    return config;
}, (error) => {
    return Promise.reject(error);
});

//Response interceptor to handle responses globally
axiosInstance.interceptors.response.use(response => {
    return response;
}, (error) => {
    if (error.response) {
        // Handle specific status codes
        if (error.response.status === 401) {        
            // Unauthorized access - possibly redirect to login
            console.error("Unauthorized access - please log in again.");
            window.location.href = '/login';
        } else if (error.response.status === 500) {
            console.error("Server error - please try again later.");
        }   
    }
    return Promise.reject(error);
});

export {axiosInstance};