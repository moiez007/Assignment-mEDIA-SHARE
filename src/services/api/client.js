import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://100.30.213.92:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000
});

function isValidToken(token) {
  return (
    typeof token === 'string' &&
    token.trim() !== '' &&
    token !== 'undefined' &&
    token !== 'null'
  );
}

apiClient.interceptors.request.use((config) => {
  const requestUrl = config?.url || '';
  const isAuthRequest =
    requestUrl.includes('/auth/login') || requestUrl.includes('/auth/signup');
  const token = localStorage.getItem('token');
  if (!isAuthRequest && isValidToken(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  config.headers.Accept = 'application/json';
  return config;
});

export default apiClient;