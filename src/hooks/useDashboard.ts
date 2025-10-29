import { useState, useEffect } from "react";
import {
  getDashboardStats,
  getComparisonStats,
  getYearlyStats,
  getMonthlyStats,
  getWeeklyStats,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [dashboard, comparison, yearly, monthly, weekly] =
        await Promise.all([
          getDashboardStats(),
          getComparisonStats(),
          getYearlyStats(),
          getMonthlyStats(),
          getWeeklyStats(),
        ]);

      setDashboardStats(dashboard);
      setComparisonData(comparison);
      setYearlyData(yearly);
      setMonthlyData(monthly);
      setWeeklyData(weekly);
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
    loading,
    error,
    refreshDashboard,
  };
};
