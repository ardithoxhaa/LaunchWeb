import axios from 'axios';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Expose all response headers for CORS
client.defaults.headers.common['Access-Control-Expose-Headers'] = 'Content-Type, Content-Disposition';

let accessToken = null;

client.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export const api = {
  setAccessToken(token) {
    accessToken = token;
  },
  get(url, config) {
    return client.get(url, config);
  },
  post(url, body, config) {
    return client.post(url, body, config);
  },
  put(url, body, config) {
    return client.put(url, body, config);
  },
  del(url, config) {
    return client.delete(url, config);
  },
};
