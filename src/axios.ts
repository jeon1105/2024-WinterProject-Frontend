// src/axios.js
import axios from "axios";

// API 호출 전 Access 토큰 갱신
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      try {
        // Refresh 토큰을 이용해 새로운 Access 토큰 요청
        await axios.post(
          "http://52.78.134.101:5000/refresh",
          {},
          { withCredentials: true }
        );
        // 원래 요청 재시도
        return axios(error.config);
      } catch (refreshError) {
        console.log(refreshError);
        // Refresh 토큰도 만료된 경우 로그아웃 처리 등
        console.error("Refresh token expired. Please log in again.");
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
