import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});
export const api = axiosInstance;

let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
    onUnauthorized = handler;
};

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401 && typeof onUnauthorized === "function") {
            onUnauthorized(error);
        }
        return Promise.reject(error);
    }
);
