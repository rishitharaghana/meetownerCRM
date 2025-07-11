import axios, { AxiosInstance } from 'axios';

const ngrokAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://ba950a1ab3e9.ngrok-free.app',

  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default ngrokAxiosInstance;