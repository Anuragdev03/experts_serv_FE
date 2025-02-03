import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_API_URL;

const http = axios.create({});

http.interceptors.request.use((config) => {
    // const token = useGetToken();

    config.baseURL = baseUrl;
    // config.headers["Content-Type"] = "application/json";
    // config.withCredentials = true;

    return config;
});

export default http;
