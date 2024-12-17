import axios from "axios";

const baseURL = "http://localhost:5000/api/v1";

const API = axios.create({
  baseURL: baseURL,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;
