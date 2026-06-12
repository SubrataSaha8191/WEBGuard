import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000" || "https://webguard-backend-h3n0.onrender.com",
});

export default API;