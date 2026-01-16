import axiosInstance from "../config/axios";

export interface TransaksiItem {
  id: number;
  transaksi_id: number;
  produk_id: number;
  produk?: {
    id: number;
    kode_produk: string;
    nama_produk: string;
    harga: number;
    satuan: string;
  };
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  created_at?: string;
  updated_at?: string;
}

export interface Transaksi {
  id: number;
  kasir_id?: number;
  no_nota: string;
  kasir?: {
    id: number;
    nama: string;
    username?: string;
    hak_akses?: string;
  };
  tgl_transaksi: string;
  harga_total: number;
  items?: TransaksiItem[];
  total_item?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface TransaksiListResponse {
  status: boolean;
  message: string;
  data: Transaksi[];
  pagination: PaginationData;
}

export interface TransaksiQueryParams {
  date?: string;
  noNota?: string;
  per_page?: number;
  page?: number;
}

// Get all transaksi with query params
export const getAllTransaksi = async (
  params?: TransaksiQueryParams
): Promise<TransaksiListResponse> => {
  try {
    const response = await axiosInstance.get("/transaksi", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching transaksi:", error);
    throw error;
  }
};

// Get transaksi by ID
export const getTransaksiById = async (id: number): Promise<Transaksi> => {
  try {
    const response = await axiosInstance.get(`/transaksi/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching transaksi:", error);
    throw error;
  }
};

// Delete/Cancel transaksi
export const deleteTransaksi = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/transaksi/${id}`);
  } catch (error) {
    console.error("Error deleting transaksi:", error);
    throw error;
  }
};

// Interface for create transaksi request (sesuai API spec)
export interface CreateTransaksiRequest {
  kasir_id: number;
  dibayar: number;
  items: {
    produk_id: number;
    jumlah: number;
  }[];
}

// Interface for create transaksi response
interface CreateTransaksiResponse {
  status: boolean;
  message: string;
  data: Transaksi;
}

// Create new transaksi
export const createTransaksi = async (
  data: CreateTransaksiRequest
): Promise<CreateTransaksiResponse> => {
  try {
    const response = await axiosInstance.post("/transaksi", data);
    return response.data;
  } catch (error) {
    console.error("Error creating transaksi:", error);
    throw error;
  }
};
