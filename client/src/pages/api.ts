import axios from "axios";

// Create an Axios instance
const api = axios.create({
    baseURL: "http://localhost:8000/api/v1", // Replace with your API URL
    withCredentials: true, // Important: Allows sending cookies
});

// Flag to prevent multiple refresh requests at the same time
let isRefreshing = false;
let refreshSubscribers : any[] = [];

// Function to handle refreshing the token
const refreshAccessToken : any = async () => {
    if (!isRefreshing) {
        isRefreshing = true;
        try {
            await api.post("/users/refresh-token"); // Request new tokens
            refreshSubscribers.forEach(callback => callback()); // Retry failed requests
            refreshSubscribers = [];
        } catch (error) {
            console.error("Refresh token expired, logging out...");
            window.location.href = "/login"; // Redirect to login if refresh fails
        } finally {
            isRefreshing = false;
        }
    }

    return new Promise((resolve : any) => {
        refreshSubscribers.push(() => resolve());
    });
};

// Axios response interceptor
api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) { 
            await refreshAccessToken(); 
            return api(error.config); 
        }
        return Promise.reject(error);
    }
);

export default api;