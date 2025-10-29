import axiosInstance from "../config/axios";

// ==================== INTERFACES ====================

export interface DashboardStats {
  cards: {
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
  inventory: {
    total_produk: string;
    total_kategori: string;
    produk_stok_menipis: string;
  };
}

export interface ComparisonChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[] | string;
    borderColor: string[] | string;
    borderWidth: number;
    yAxisID?: string;
    tension?: number;
  }[];
}

export interface StatistikResponse {
  status: boolean;
  message: string;
  chart_data: ComparisonChartData;
}

export interface DashboardResponse {
  status: boolean;
  message: string;
  data: DashboardStats;
}

// ==================== SERVICE FUNCTIONS ====================

/**
 * Get dashboard statistics (cards data)
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await axiosInstance.get<DashboardResponse>(
      "/statistik/dashboard"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

/**
 * Get comparison statistics (bar chart data)
 */
export const getComparisonStats = async (): Promise<ComparisonChartData> => {
  try {
    const response = await axiosInstance.get<StatistikResponse>(
      "/statistik/comparison"
    );
    return response.data.chart_data;
  } catch (error) {
    console.error("Error fetching comparison stats:", error);
    throw error;
  }
};

/**
 * Get yearly statistics (monthly trend)
 */
export const getYearlyStats = async (
  tahun?: number
): Promise<ComparisonChartData> => {
  try {
    const params = tahun ? { tahun } : {};
    const response = await axiosInstance.get<StatistikResponse>(
      "/statistik/tahunan",
      { params }
    );
    return response.data.chart_data;
  } catch (error) {
    console.error("Error fetching yearly stats:", error);
    throw error;
  }
};

/**
 * Get monthly statistics (daily trend)
 */
export const getMonthlyStats = async (
  bulan?: number,
  tahun?: number
): Promise<ComparisonChartData> => {
  try {
    const params: { bulan?: number; tahun?: number } = {};
    if (bulan) params.bulan = bulan;
    if (tahun) params.tahun = tahun;

    const response = await axiosInstance.get<StatistikResponse>(
      "/statistik/bulanan",
      { params }
    );
    return response.data.chart_data;
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    throw error;
  }
};

/**
 * Get weekly statistics (last 7 days)
 */
export const getWeeklyStats = async (
  tanggal_akhir?: string
): Promise<ComparisonChartData> => {
  try {
    const params = tanggal_akhir ? { tanggal_akhir } : {};
    const response = await axiosInstance.get<StatistikResponse>(
      "/statistik/mingguan",
      { params }
    );
    return response.data.chart_data;
  } catch (error) {
    console.error("Error fetching weekly stats:", error);
    throw error;
  }
};
