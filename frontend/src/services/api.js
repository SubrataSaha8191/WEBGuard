import axios from "axios";

const API = axios.create({
  baseURL: "https://webguard-backend-h3n0.onrender.com",
});

export default API;