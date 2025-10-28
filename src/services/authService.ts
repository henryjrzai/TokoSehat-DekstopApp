import axiosInstance from "../config/axios";

// Interface untuk request login
export interface LoginRequest {
  username: string;
  password: string;
}

// Interface untuk User dari API
export interface User {
  id: number;
  nama: string;
  username: string;
  hak_akses: string;
  created_at: string;
  updated_at: string;
}

// Interface untuk response login dari API
export interface LoginResponse {
  status: string;
  message: string;
  data: User;
  token: string;
}

// Service untuk login
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>(
      "/login",
      credentials
    );

    // Simpan token ke localStorage
    if (response.data.token) {
      localStorage.setItem("bearer_token", response.data.token);

      // Simpan data user jika ada
      if (response.data.data) {
        localStorage.setItem("user_data", JSON.stringify(response.data.data));
      }
    }

    return response.data;
  } catch (error: unknown) {
    // Handle error
    if (error instanceof Error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        request?: unknown;
      };
      if (axiosError.response) {
        throw new Error(axiosError.response.data?.message || "Login gagal");
      } else if (axiosError.request) {
        throw new Error("Tidak dapat terhubung ke server");
      }
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Service untuk logout
export const logout = (): void => {
  // Hapus token dan data user dari localStorage
  localStorage.removeItem("bearer_token");
  localStorage.removeItem("user_data");
};

// Service untuk cek apakah user sudah login
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("bearer_token");
  return !!token;
};

// Service untuk mendapatkan token
export const getToken = (): string | null => {
  return localStorage.getItem("bearer_token");
};

// Interface untuk User data
export interface UserData {
  id: number;
  nama: string;
  username: string;
  hak_akses: string;
  created_at: string;
  updated_at: string;
}

// Service untuk mendapatkan data user
export const getUserData = (): UserData | null => {
  const userData = localStorage.getItem("user_data");
  return userData ? JSON.parse(userData) : null;
};
