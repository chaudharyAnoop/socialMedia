import axios from "axios";
import { getInstagramUser } from "../constants/localStorage";
import { BASE_URL_USER, BASE_URL_FEED } from "../api/endpoints";

const commentApi = axios.create({
  baseURL: BASE_URL_USER,
  headers: {
    "Content-Type": "application/json",
  },
});

const postApi = axios.create({
  baseURL: BASE_URL_FEED,
  headers: {
    "Content-Type": "application/json",
  },
});

const authApi = axios.create({
  baseURL: BASE_URL_USER,
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
  const token = getInstagramUser();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

postApi.interceptors.request.use((config) => {
  const token = getInstagramUser();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

authApi.interceptors.request.use((config) => {
  const token = getInstagramUser();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

notificationApi.interceptors.request.use((config) => {
  const token = getInstagramUser();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export { commentApi, postApi };
