import axiosInstance from "../config/axios";

// Interface untuk Kategori Produk
export interface KategoriProduk {
  id: number;
  nama_kategori: string;
  deskripsi?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface untuk request create/update kategori
export interface KategoriProdukRequest {
  nama_kategori: string;
  deskripsi?: string;
}

// Interface untuk response API
interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

// Get all kategori produk
export const getAllKategoriProduk = async (): Promise<KategoriProduk[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<KategoriProduk[]>>(
      "/kategori-produk"
    );
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengambil data kategori");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Get kategori by ID
export const getKategoriProdukById = async (
  id: number
): Promise<KategoriProduk> => {
  try {
    const response = await axiosInstance.get<ApiResponse<KategoriProduk>>(
      `/kategori-produk/${id}`
    );
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengambil detail kategori");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Create new kategori
export const createKategoriProduk = async (
  kategori: KategoriProdukRequest
): Promise<KategoriProduk> => {
  try {
    const response = await axiosInstance.post<ApiResponse<KategoriProduk>>(
      "/kategori-produk",
      kategori
    );
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal membuat kategori");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Update kategori
export const updateKategoriProduk = async (
  id: number,
  kategori: KategoriProdukRequest
): Promise<KategoriProduk> => {
  try {
    const response = await axiosInstance.put<ApiResponse<KategoriProduk>>(
      `/kategori-produk/${id}`,
      kategori
    );
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengupdate kategori");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Delete kategori
export const deleteKategoriProduk = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/kategori-produk/${id}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal menghapus kategori");
    }
    throw new Error("Terjadi kesalahan");
  }
};
