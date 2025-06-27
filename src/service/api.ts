import axios from "axios";
import { token } from "../constants/localStorage";

const commentApi = axios.create({
  baseURL: "http://172.50.5.102:3008",
  headers: {
    "Content-Type": "application/json",
  },
});

const postApi = axios.create({
  baseURL: "http://172.50.5.102:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

const authApi = axios.create({
  baseURL: "http://172.50.5.102:3011",
  headers: {
    "Content-Type": "application/json",
  },
});

const notificationApi = axios.create({
  baseURL: "http://172.50.5.102:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

commentApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

postApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

authApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

notificationApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export { commentApi, postApi };
