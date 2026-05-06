import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
    onUnauthorized = handler;
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401 && typeof onUnauthorized === "function") {
            onUnauthorized(error);
        }
        return Promise.reject(error);
    }
);
