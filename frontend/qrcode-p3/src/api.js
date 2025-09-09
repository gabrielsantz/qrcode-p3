import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://43e019808883.ngrok-free.app/api', 
  withCredentials: true, 
});

export default apiClient;