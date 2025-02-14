import axios from "axios";

export const baseUrl = import.meta.env.VITE_BASE_API_URL;

const http = axios.create({});

http.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");

    config.baseURL = baseUrl;
    // config.headers.set("ngrok-skip-browser-warning", "true");
    // config.headers["Content-Type"] = "application/json";
    // config.withCredentials = true;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default http;
