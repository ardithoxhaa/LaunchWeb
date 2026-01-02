import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

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
