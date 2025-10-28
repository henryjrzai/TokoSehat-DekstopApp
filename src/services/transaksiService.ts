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
  };
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  created_at?: string;
  updated_at?: string;
}

export interface Transaksi {
  id: number;
  kasir_id: number;
  no_nota: string;
  kasir?: {
    id: number;
    nama: string;
    username: string;
    hak_akses: string;
  };
  tgl_transaksi: string;
  harga_total: number;
  items?: TransaksiItem[];
  created_at?: string;
  updated_at?: string;
}

// Get all transaksi
export const getAllTransaksi = async (): Promise<Transaksi[]> => {
  try {
    const response = await axiosInstance.get("/transaksi");
    return response.data.data;
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
