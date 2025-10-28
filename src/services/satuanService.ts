import axiosInstance from "../config/axios";

// Interface untuk Satuan
export interface Satuan {
  id: number;
  kode_satuan: string;
  nama_satuan: string;
  deskripsi?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface untuk request create/update satuan
export interface SatuanRequest {
  kode_satuan: string;
  nama_satuan: string;
  deskripsi?: string;
}

// Interface untuk response API
interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

// Get all satuan
export const getAllSatuan = async (): Promise<Satuan[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Satuan[]>>("/satuan");
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengambil data satuan");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Get satuan by ID
export const getSatuanById = async (id: number): Promise<Satuan> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Satuan>>(
      `/satuan/${id}`
    );
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengambil detail satuan");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Create new satuan
export const createSatuan = async (satuan: SatuanRequest): Promise<Satuan> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Satuan>>(
      "/satuan",
      satuan
    );
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal membuat satuan");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Update satuan
export const updateSatuan = async (
  id: number,
  satuan: SatuanRequest
): Promise<Satuan> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Satuan>>(
      `/satuan/${id}`,
      satuan
    );
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengupdate satuan");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Delete satuan
export const deleteSatuan = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/satuan/${id}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal menghapus satuan");
    }
    throw new Error("Terjadi kesalahan");
  }
};
