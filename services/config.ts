import axios from "axios";

const fetcher = axios.create({
  baseURL: process.env.BACKEND_URL, // BE side only
});

fetcher.interceptors.request.use(function (config) {
  if (config.headers) {
    config.withCredentials = true;
  }
  return config;
});

export default fetcher;
