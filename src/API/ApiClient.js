import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://asadbek6035.pythonanywhere.com",
});

apiClient.interceptors.request.use((config) => {
    let token = localStorage.getItem("token");
    let parsedToken = null;

    try {
        parsedToken = token ? JSON.parse(token) : null;
    } catch (error) {
        console.error("Tokenni parse qilishda xatolik:", error);
        localStorage.removeItem("token");
    }

    if (parsedToken?.access) {
        config.headers["Authorization"] = `Bearer ${parsedToken.access}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});



//  Xatolikni ushlash va token muddati tugasa, login sahifasiga yo‘naltirish
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                console.warn("Token eskirgan yoki noto‘g‘ri! Foydalanuvchi tizimdan chiqariladi.");
                localStorage.removeItem("token");
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.error("Server xatosi! Backend loglarini tekshiring.");
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
