import axiosInstance from "../config/axios";

// Interface untuk User
export interface User {
  id: number;
  nama: string;
  username: string;
  hak_akses: "admin" | "kasir" | "pemilik";
  created_at?: string;
  updated_at?: string;
}

// Interface untuk request create user (register)
export interface UserRegisterRequest {
  nama: string;
  username: string;
  password: string;
  hak_akses: "admin" | "kasir" | "pemilik";
}

// Interface untuk request update user
export interface UserUpdateRequest {
  nama: string;
  username: string;
  hak_akses: "admin" | "kasir" | "pemilik";
}

// Interface untuk change password
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// Interface untuk response API
interface ApiResponse<T> {
  status: boolean | string;
  message: string;
  data: T;
}

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User[]>>("/users");
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengambil data user");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Get user by ID
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await axiosInstance.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengambil detail user");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Register new user (hanya admin)
export const registerUser = async (
  user: UserRegisterRequest
): Promise<User> => {
  try {
    const response = await axiosInstance.post<ApiResponse<User>>(
      "/register",
      user
    );
    return response.data.data;
  } catch (error: unknown) {
    // Handle axios error dengan lebih detail
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { data?: { message?: string; error?: string } };
      };
      const message =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "Gagal mendaftarkan user";
      throw new Error(message);
    } else if (error && typeof error === "object" && "request" in error) {
      // Request made but no response
      throw new Error("Tidak dapat terhubung ke server");
    } else if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Update user
export const updateUser = async (
  id: number,
  user: UserUpdateRequest
): Promise<User> => {
  try {
    const response = await axiosInstance.put<ApiResponse<User>>(
      `/users/${id}`,
      user
    );
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengupdate user");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Delete user
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/${id}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal menghapus user");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Change password
export const changePassword = async (
  id: number,
  passwords: ChangePasswordRequest
): Promise<void> => {
  try {
    await axiosInstance.patch(`/users/${id}/change-password`, passwords);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengubah password");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Search users
export const searchUsers = async (
  searchTerm: string,
  limit: number = 10
): Promise<User[]> => {
  try {
    const response = await axiosInstance.post<ApiResponse<User[]>>(
      "/users/search",
      { search: searchTerm, limit }
    );
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mencari user");
    }
    throw new Error("Terjadi kesalahan");
  }
};
