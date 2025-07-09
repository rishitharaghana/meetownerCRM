import axios, { AxiosInstance } from 'axios';

const ngrokAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://e4807673a357.ngrok-free.app',

  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default ngrokAxiosInstance;