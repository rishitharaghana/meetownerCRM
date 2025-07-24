import axios, { AxiosInstance } from "axios";

const ngrokAxiosInstance: AxiosInstance = axios.create({
  baseURL: "https://crmapi.mntechs.com",
  // baseURL: 'http://localhost:3002',
  headers: {
    "Content-Type": "application/json",
  },
});

export default ngrokAxiosInstance;


