import axios, { AxiosInstance } from "axios";

const ngrokAxiosInstance: AxiosInstance = axios.create({
  // baseURL: 'https://72189bcc9357.ngrok-free.app',
  baseURL: "https://crmapi.mntechs.com",

  headers: {
    "Content-Type": "application/json",
  },
});

export default ngrokAxiosInstance;


