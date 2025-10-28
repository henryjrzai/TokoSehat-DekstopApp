import axiosInstance from "../config/axios";

// ==================== INTERFACES ====================

export interface LaporanPeriodeRequest {
  tanggal_awal: string; // format: YYYY-MM-DD
  tanggal_akhir: string; // format: YYYY-MM-DD
}

export interface LaporanBulananRequest {
  bulan: number; // 1-12
  tahun: number;
}

export interface LaporanProdukTerlarisRequest {
  tanggal_awal: string;
  tanggal_akhir: string;
  limit?: number; // default 10
}

export interface TransaksiLaporan {
  id: number;
  no_nota: string;
  tgl_transaksi: string;
  kasir_nama: string;
  harga_total: number;
  jumlah_item: number;
}

export interface ProdukTerlaris {
  produk_id: number;
  kode_produk: string;
  nama_produk: string;
  total_terjual: number;
  total_pendapatan: number;
}

export interface LaporanPeriodeResponse {
  status: boolean;
  message: string;
  data: {
    periode: {
      tanggal_awal: string;
      tanggal_akhir: string;
    };
    summary: {
      total_transaksi: number;
      total_pendapatan: number;
      rata_rata_transaksi: number;
    };
    transaksi: TransaksiLaporan[];
  };
}

export interface LaporanBulananResponse {
  status: boolean;
  message: string;
  data: {
    periode: {
      bulan: number;
      tahun: number;
      nama_bulan: string;
    };
    summary: {
      total_transaksi: number;
      total_pendapatan: number;
      rata_rata_transaksi: number;
    };
    transaksi: TransaksiLaporan[];
  };
}

export interface LaporanProdukTerlarisResponse {
  status: boolean;
  message: string;
  data: {
    periode: {
      tanggal_awal: string;
      tanggal_akhir: string;
    };
    produk: ProdukTerlaris[];
  };
}

export interface DashboardStatistikResponse {
  status: boolean;
  message: string;
  data: {
    total_transaksi_hari_ini: number;
    total_pendapatan_hari_ini: number;
    total_transaksi_bulan_ini: number;
    total_pendapatan_bulan_ini: number;
  };
}

export interface StatistikComparisonResponse {
  status: boolean;
  message: string;
  data: {
    hari_ini: {
      total_transaksi: number;
      total_pendapatan: number;
    };
    minggu_ini: {
      total_transaksi: number;
      total_pendapatan: number;
    };
    bulan_ini: {
      total_transaksi: number;
      total_pendapatan: number;
    };
    tahun_ini: {
      total_transaksi: number;
      total_pendapatan: number;
    };
  };
}

export interface StatistikTahunanResponse {
  status: boolean;
  message: string;
  data: {
    tahun: number;
    bulan: Array<{
      bulan: number;
      nama_bulan: string;
      total_transaksi: number;
      total_pendapatan: number;
    }>;
  };
}

export interface StatistikBulananResponse {
  status: boolean;
  message: string;
  data: {
    bulan: number;
    tahun: number;
    nama_bulan: string;
    hari: Array<{
      tanggal: string;
      total_transaksi: number;
      total_pendapatan: number;
    }>;
  };
}

export interface StatistikMingguanResponse {
  status: boolean;
  message: string;
  data: {
    tanggal_awal: string;
    tanggal_akhir: string;
    hari: Array<{
      tanggal: string;
      nama_hari: string;
      total_transaksi: number;
      total_pendapatan: number;
    }>;
  };
}

// ==================== LAPORAN PERIODE ====================

/**
 * Get laporan transaksi berdasarkan periode
 */
export const getLaporanPeriode = async (
  params: LaporanPeriodeRequest
): Promise<LaporanPeriodeResponse> => {
  try {
    const response = await axiosInstance.post("/laporan/periode", params);
    return response.data;
  } catch (error) {
    console.error("Error fetching laporan periode:", error);
    throw error;
  }
};

/**
 * Export laporan periode ke PDF
 * Returns a blob URL or base64 string that can be downloaded
 */
export const exportLaporanPeriodePDF = async (
  params: LaporanPeriodeRequest
): Promise<Blob> => {
  try {
    const response = await axiosInstance.post("/laporan/periode/pdf", params, {
      responseType: "blob", // Important for PDF download
    });
    return response.data;
  } catch (error) {
    console.error("Error exporting laporan periode PDF:", error);
    throw error;
  }
};

// ==================== LAPORAN BULANAN ====================

/**
 * Get laporan transaksi bulanan
 */
export const getLaporanBulanan = async (
  params: LaporanBulananRequest
): Promise<LaporanBulananResponse> => {
  try {
    const response = await axiosInstance.post("/laporan/bulanan", params);
    return response.data;
  } catch (error) {
    console.error("Error fetching laporan bulanan:", error);
    throw error;
  }
};

/**
 * Export laporan bulanan ke PDF
 * Returns a blob that can be downloaded
 */
export const exportLaporanBulananPDF = async (
  params: LaporanBulananRequest
): Promise<Blob> => {
  try {
    const response = await axiosInstance.post("/laporan/bulanan/pdf", params, {
      responseType: "blob", // Important for PDF download
    });
    return response.data;
  } catch (error) {
    console.error("Error exporting laporan bulanan PDF:", error);
    throw error;
  }
};

// ==================== LAPORAN PRODUK TERLARIS ====================

/**
 * Get laporan produk terlaris
 */
export const getLaporanProdukTerlaris = async (
  params: LaporanProdukTerlarisRequest
): Promise<LaporanProdukTerlarisResponse> => {
  try {
    const response = await axiosInstance.post(
      "/laporan/produk-terlaris",
      params
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching laporan produk terlaris:", error);
    throw error;
  }
};

/**
 * Export laporan produk terlaris ke PDF
 */
export const exportLaporanProdukTerlarisPDF = async (
  params: LaporanProdukTerlarisRequest
): Promise<Blob> => {
  try {
    const response = await axiosInstance.post(
      "/laporan/produk-terlaris/pdf",
      params,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error exporting laporan produk terlaris PDF:", error);
    throw error;
  }
};

// ==================== STATISTIK DASHBOARD ====================

/**
 * Get dashboard statistik
 */
export const getDashboardStatistik =
  async (): Promise<DashboardStatistikResponse> => {
    try {
      const response = await axiosInstance.get("/statistik/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard statistik:", error);
      throw error;
    }
  };

/**
 * Get statistik comparison (Bar Chart)
 */
export const getStatistikComparison =
  async (): Promise<StatistikComparisonResponse> => {
    try {
      const response = await axiosInstance.get("/statistik/comparison");
      return response.data;
    } catch (error) {
      console.error("Error fetching statistik comparison:", error);
      throw error;
    }
  };

/**
 * Get statistik tahunan (per bulan)
 */
export const getStatistikTahunan = async (
  tahun?: number
): Promise<StatistikTahunanResponse> => {
  try {
    const params = tahun ? { tahun } : {};
    const response = await axiosInstance.get("/statistik/tahunan", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching statistik tahunan:", error);
    throw error;
  }
};

/**
 * Get statistik bulanan (per hari)
 */
export const getStatistikBulanan = async (
  bulan?: number,
  tahun?: number
): Promise<StatistikBulananResponse> => {
  try {
    const params: Record<string, number> = {};
    if (bulan) params.bulan = bulan;
    if (tahun) params.tahun = tahun;
    const response = await axiosInstance.get("/statistik/bulanan", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching statistik bulanan:", error);
    throw error;
  }
};

/**
 * Get statistik mingguan (7 hari terakhir)
 */
export const getStatistikMingguan = async (
  tanggal_akhir?: string
): Promise<StatistikMingguanResponse> => {
  try {
    const params = tanggal_akhir ? { tanggal_akhir } : {};
    const response = await axiosInstance.get("/statistik/mingguan", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching statistik mingguan:", error);
    throw error;
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Download blob as PDF file
 * Helper function to trigger download in browser
 */
export const downloadPDF = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Format date for API (YYYY-MM-DD)
 */
export const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Get nama bulan Indonesia
 */
export const getNamaBulan = (bulan: number): string => {
  const namaBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return namaBulan[bulan - 1] || "";
};
