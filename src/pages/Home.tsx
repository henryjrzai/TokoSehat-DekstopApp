import { useAuth } from "../hooks/useAuth";
import { useDashboard } from "../hooks/useDashboard";
import { ApexChartComponent } from "../components/ApexChartComponent";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const {
    dashboardStats,
    comparisonData,
    yearlyData,
    monthlyData,
    weeklyData,
    loading,
    error,
    refreshDashboard,
  } = useDashboard();

  // Load ApexCharts from public assets
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/assets/vendors/apexcharts/apexcharts.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Fungsi untuk mendapatkan sapaan berdasarkan waktu
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) {
      return "Selamat Pagi";
    } else if (hour < 15) {
      return "Selamat Siang";
    } else if (hour < 18) {
      return "Selamat Sore";
    } else {
      return "Selamat Malam";
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Dashboard</h3>
            <p className="text-subtitle text-muted">
              Toko Sehat Kabanjahe - Sistem Kasir
            </p>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <button
                className="btn btn-primary btn-sm"
                onClick={refreshDashboard}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise"></i> Refresh
              </button>
            </nav>
          </div>
        </div>
      </div>

      <section className="section">
        {/* Welcome Card */}
        <div className="card">
          <div className="card-body py-4 px-5">
            <div className="d-flex align-items-center">
              <div className="ms-3 name">
                <h5 className="font-bold mb-1">
                  {getGreeting()}, {user?.nama || "User"}!
                </h5>
                <h6 className="text-muted mb-0">
                  @{user?.username} · {user?.hak_akses}
                </h6>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger alert-dismissible show fade">
            <i className="bi bi-exclamation-circle"></i> {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => window.location.reload()}
            ></button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Memuat data statistik...</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="row">
              {/* Hari Ini */}
              <div className="col-6 col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body px-4 py-4-5">
                    <div className="row">
                      <div className="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start">
                        <div className="stats-icon purple mb-2">
                          <i className="iconly-boldShow"></i>
                        </div>
                      </div>
                      <div className="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                        <h6 className="text-muted font-semibold">Hari Ini</h6>
                        <h6 className="font-extrabold mb-0">
                          {dashboardStats?.cards.hari_ini.total_transaksi || 0}{" "}
                          Transaksi
                        </h6>
                        <small className="text-muted">
                          {formatCurrency(
                            dashboardStats?.cards.hari_ini.total_pendapatan || 0
                          )}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Minggu Ini */}
              <div className="col-6 col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body px-4 py-4-5">
                    <div className="row">
                      <div className="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start">
                        <div className="stats-icon blue mb-2">
                          <i className="iconly-boldProfile"></i>
                        </div>
                      </div>
                      <div className="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                        <h6 className="text-muted font-semibold">Minggu Ini</h6>
                        <h6 className="font-extrabold mb-0">
                          {dashboardStats?.cards.minggu_ini.total_transaksi ||
                            0}{" "}
                          Transaksi
                        </h6>
                        <small className="text-muted">
                          {formatCurrency(
                            dashboardStats?.cards.minggu_ini.total_pendapatan ||
                              0
                          )}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bulan Ini */}
              <div className="col-6 col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body px-4 py-4-5">
                    <div className="row">
                      <div className="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start">
                        <div className="stats-icon green mb-2">
                          <i className="iconly-boldAdd-User"></i>
                        </div>
                      </div>
                      <div className="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                        <h6 className="text-muted font-semibold">Bulan Ini</h6>
                        <h6 className="font-extrabold mb-0">
                          {dashboardStats?.cards.bulan_ini.total_transaksi || 0}{" "}
                          Transaksi
                        </h6>
                        <small className="text-muted">
                          {formatCurrency(
                            dashboardStats?.cards.bulan_ini.total_pendapatan ||
                              0
                          )}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tahun Ini */}
              <div className="col-6 col-lg-3 col-md-6">
                <div className="card">
                  <div className="card-body px-4 py-4-5">
                    <div className="row">
                      <div className="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start">
                        <div className="stats-icon red mb-2">
                          <i className="iconly-boldBookmark"></i>
                        </div>
                      </div>
                      <div className="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                        <h6 className="text-muted font-semibold">Tahun Ini</h6>
                        <h6 className="font-extrabold mb-0">
                          {dashboardStats?.cards.tahun_ini.total_transaksi || 0}{" "}
                          Transaksi
                        </h6>
                        <small className="text-muted">
                          {formatCurrency(
                            dashboardStats?.cards.tahun_ini.total_pendapatan ||
                              0
                          )}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="row">
              {/* Comparison Chart */}
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h4>Perbandingan Penjualan</h4>
                  </div>
                  <div className="card-body">
                    {comparisonData && (
                      <ApexChartComponent
                        data={comparisonData}
                        type="bar"
                        height={350}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {/* Yearly Chart */}
              <div className="col-12 col-lg-6">
                <div className="card">
                  <div className="card-header">
                    <h4>Penjualan Tahunan (Per Bulan)</h4>
                  </div>
                  <div className="card-body">
                    {yearlyData && (
                      <ApexChartComponent
                        data={yearlyData}
                        type="line"
                        height={300}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Monthly Chart */}
              <div className="col-12 col-lg-6">
                <div className="card">
                  <div className="card-header">
                    <h4>Penjualan Bulanan (Per Hari)</h4>
                  </div>
                  <div className="card-body">
                    {monthlyData && (
                      <ApexChartComponent
                        data={monthlyData}
                        type="line"
                        height={300}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {/* Weekly Chart */}
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h4>Penjualan Mingguan (7 Hari Terakhir)</h4>
                  </div>
                  <div className="card-body">
                    {weeklyData && (
                      <ApexChartComponent
                        data={weeklyData}
                        type="bar"
                        height={300}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
