import axios, { AxiosInstance } from 'axios';

const ngrokAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://5a80cd0947f8.ngrok-free.app',

  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default ngrokAxiosInstance;