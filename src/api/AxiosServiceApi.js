import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://freelancegobackend.onrender.com",
});
