import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://18.217.93.4/api', 
  withCredentials: true, 
});

export default apiClient;