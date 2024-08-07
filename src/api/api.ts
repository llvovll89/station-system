import axios from "axios";
import { BASE_URL } from "../constant/http";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// 응답 인터셉터
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 401 에러 발생 시 로그인 페이지로 리디렉션

        if (error.response && error.response.status === 401) {
            localStorage.removeItem("user");
            window.location.href = "http://station-simulator.dev-kits.store/";
        }
        return Promise.reject(error);
    },
);

export default api;
