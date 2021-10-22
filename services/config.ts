import axios from "axios";
import { BACKEND_URL } from "constants/platform";

const fetcher = axios.create({
  baseURL: BACKEND_URL,
});

fetcher.interceptors.request.use(function (config) {
  if (config.headers) {
    config.withCredentials = true;
  }
  return config;
});

// Add a 401 response interceptor
fetcher.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (401 === error.response.status) {
      return 401;
    }
    return error;
  }
);

export default fetcher;
