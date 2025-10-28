import axiosInstance from "../config/axios";

// Interface untuk Produk
export interface Produk {
  id: number;
  satuan_id: number;
  kategori_id: number;
  kode_produk: string;
  nama_produk: string;
  harga: number;
  stok: number;
  created_at?: string;
  updated_at?: string;
  satuan?: {
    id: number;
    kode_satuan: string;
    nama_satuan: string;
    deskripsi?: string;
  };
  kategori?: {
    id: number;
    nama_kategori: string;
    deskripsi?: string;
  };
}

// Interface untuk request create/update produk
export interface ProdukRequest {
  satuan_id: number;
  kategori_id: number;
  kode_produk: string;
  nama_produk: string;
  harga: number;
  stok: number;
}

// Interface untuk response API
interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

// Interface untuk search response
interface SearchResponse {
  status: boolean;
  message: string;
  search_term: string;
  total_found: number;
  data: Produk[];
}

// Get all products
export const getAllProduk = async (): Promise<Produk[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Produk[]>>("/produk");
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengambil data produk");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Get product by ID
export const getProdukById = async (id: number): Promise<Produk> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Produk>>(
      `/produk/${id}`
    );
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengambil detail produk");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Create new product
export const createProduk = async (produk: ProdukRequest): Promise<Produk> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Produk>>(
      "/produk",
      produk
    );
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal membuat produk");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Update product
export const updateProduk = async (
  id: number,
  produk: ProdukRequest
): Promise<Produk> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Produk>>(
      `/produk/${id}`,
      produk
    );
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengupdate produk");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Delete product
export const deleteProduk = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/produk/${id}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal menghapus produk");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Search products
export const searchProduk = async (
  searchTerm: string,
  limit: number = 10
): Promise<SearchResponse> => {
  try {
    const response = await axiosInstance.get<SearchResponse>("/produk/search", {
      params: {
        search: searchTerm,
        limit: limit,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mencari produk");
    }
    throw new Error("Terjadi kesalahan");
  }
};

// Update product stock
export const updateProdukStock = async (
  id: number,
  quantity: number,
  operation: "add" | "subtract" = "add"
): Promise<Produk> => {
  try {
    const response = await axiosInstance.patch<ApiResponse<Produk>>(
      `/produk/${id}/stock`,
      {
        quantity,
        operation,
      }
    );
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Gagal mengupdate stok");
    }
    throw new Error("Terjadi kesalahan");
  }
};
