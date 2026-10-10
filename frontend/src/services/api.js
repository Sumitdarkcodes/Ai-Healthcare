import axios from "axios";

// axios instance used by all pages
// in dev, Vite proxy forwards /api to localhost:5000
// in production, VITE_API_URL points to the deployed backend
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",     // default to /api in dev
    withCredentials: true                                // send cookies with requests
});

export default api;