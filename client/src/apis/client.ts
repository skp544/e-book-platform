import axios from "axios";

const baseURL = "http://localhost:8000";

const client = axios.create({
  baseURL,
});

client.interceptors.request.use(function (config) {
  config.withCredentials = true;

  return config;
});

export default client;
