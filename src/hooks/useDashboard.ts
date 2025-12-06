import { useState, useEffect } from "react";
import {
  getDashboardStats,
  getComparisonStats,
  getYearlyStats,
  getMonthlyStats,
  getWeeklyStats,
  getTrendPenjualan,
  DashboardStats,
  ComparisonChartData,
} from "../services/dashboardService";

export const useDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [comparisonData, setComparisonData] =
    useState<ComparisonChartData | null>(null);
  const [yearlyData, setYearlyData] = useState<ComparisonChartData | null>(
    null
  );
  const [monthlyData, setMonthlyData] = useState<ComparisonChartData | null>(
    null
  );
  const [weeklyData, setWeeklyData] = useState<ComparisonChartData | null>(
    null
  );
  const [trendTransaksiData, setTrendTransaksiData] =
    useState<ComparisonChartData | null>(null);
  const [trendPendapatanData, setTrendPendapatanData] =
    useState<ComparisonChartData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboard, comparison, yearly, monthly, weekly, trend] =
        await Promise.all([
          getDashboardStats(),
          getComparisonStats(),
          getYearlyStats(),
          getMonthlyStats(),
          getWeeklyStats(),
          getTrendPenjualan(),
        ]);

      setDashboardStats(dashboard);
      setComparisonData(comparison);
      setYearlyData(yearly);
      setMonthlyData(monthly);
      setWeeklyData(weekly);

      // Memisahkan trendData menjadi dua
      if (trend && trend.datasets) {
        const transaksiDataset = trend.datasets.find((ds) =>
          ds.label.toLowerCase().includes("transaksi")
        );
        const pendapatanDataset = trend.datasets.find((ds) =>
          ds.label.toLowerCase().includes("pendapatan")
        );

        if (transaksiDataset) {
          setTrendTransaksiData({
            labels: trend.labels,
            datasets: [transaksiDataset],
          });
        }

        if (pendapatanDataset) {
          setTrendPendapatanData({
            labels: trend.labels,
            datasets: [pendapatanDataset],
          });
        }
      }
    } catch (err) {
      setError("Gagal memuat data dashboard");
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = () => {
    fetchDashboardData();
  };

  return {
    dashboardStats,
    comparisonData,
    yearlyData,
    monthlyData,
    weeklyData,
    trendTransaksiData,
    trendPendapatanData,
    loading,
    error,
    refreshDashboard,
  };
};
