import axios from "axios";
import { BACKEND_URL } from "constants/platform";

const fetcher = axios.create({
  baseURL: BACKEND_URL,
});

// fetcher.interceptors.request.use(function (config) {
//   if (config.headers) {
//     config.withCredentials = true;
//   }
//   return config;
// });

export default fetcher;
