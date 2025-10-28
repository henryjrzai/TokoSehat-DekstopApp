import axios from "axios";

// Base URL dari API
const BASE_URL = "http://kasir-toko-sehat-ws.test/api";

// Membuat instance axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk menambahkan token ke setiap request
axiosInstance.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem("bearer_token");

    // Jika token ada, tambahkan ke header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle error 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Jika mendapat response 401, hapus token dan redirect ke login
    if (error.response?.status === 401) {
      localStorage.removeItem("bearer_token");
      localStorage.removeItem("user_data");
      // Reload halaman agar kembali ke login
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
