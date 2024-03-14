import axios from "axios";

const baseURL = "http://localhost:5000/api/v1";

export const devUserID = "65eb11e4ec9d754be4ccd562"

const API = axios.create({
  baseURL: baseURL,
});

API.interceptors.request.use((req) => {
  req.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
  return req;
});

export default API;