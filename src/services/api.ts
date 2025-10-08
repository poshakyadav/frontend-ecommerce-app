import axios from 'axios';

// Create a single axios instance with auth interceptor
const api = axios.create({ baseURL: "http://localhost:8080/api" });

// Request: attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response: handle 401
// api.interceptors.response.use(
//   resp => resp,
//   err => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem('access_token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(err);
//   }
// );
api.interceptors.response.use(
  resp => resp,
  err => {
    if (err.response?.status === 401 && err.config.url !== '/users/me') {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;