import axios from 'axios';
const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000' });
api.interceptors.request.use((config)=>{ const t=localStorage.getItem('token'); if(t) config.headers.Authorization=`Bearer ${t}`; return config;});
export default api;
