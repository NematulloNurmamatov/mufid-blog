import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://asadbek6035.pythonanywhere.com",
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        const parsedToken = JSON.parse(token); 
        if (parsedToken?.access) {
            config.headers["Authorization"] = `Bearer ${parsedToken.access}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default apiClient;
