import axios from 'axios';
import { User } from '../../features/auth/constants';

import { API_AUTH } from './apiConfig';

const authApi = axios.create({
  baseURL: API_AUTH,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found in localStorage for request to:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const loginApi = async (credentials: any) => {
  const response = await authApi.post<string>('/login', credentials);
  return response.data;
};

export const registerApi = async (userData: any) => {
  const response = await authApi.post<User>('/register', userData);
  return response.data;
};

export const getProfileApi = async (userId: number) => {
  const response = await authApi.get<User>(`/profile/${userId}`);
  return response.data;
};

export const validateTokenApi = async () => {
  const response = await authApi.get<boolean>('/validate');
  return response.data;
};

export default authApi;
