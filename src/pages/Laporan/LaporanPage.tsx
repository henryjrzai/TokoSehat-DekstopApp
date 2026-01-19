import { useState, useEffect, useMemo } from "react";
import {
  exportLaporanBulananPDF,
  downloadPDF,
  LaporanBulananRequest,
  getLaporanLabaRugi,
  exportLaporanLabaRugiPDF,
  LaporanLabaRugiRequest,
  LaporanLabaRugiResponse,
} from "../../services/laporanService";
import {
  getAllProdukHistory,
  AllProdukHistoryItem,
} from "../../services/produkService";

const LaporanPage = () => {
  // State for Laporan Harian
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [loadingBulanan, setLoadingBulanan] = useState(false);

  // State for Laporan Laba Rugi
  const [tanggalAwalLabaRugi, setTanggalAwalLabaRugi] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
  );
  const [tanggalAkhirLabaRugi, setTanggalAkhirLabaRugi] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [loadingLabaRugi, setLoadingLabaRugi] = useState(false);
  const [dataLabaRugi, setDataLabaRugi] =
    useState<LaporanLabaRugiResponse | null>(null);

  // State for Product History
  const [history, setHistory] = useState<AllProdukHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [errorHistory, setErrorHistory] = useState<string | null>(null);

  // State for Filters
  const [filterTanggalAwal, setFilterTanggalAwal] = useState("");
  const [filterTanggalAkhir, setFilterTanggalAkhir] = useState("");
  const [filterProduk, setFilterProduk] = useState("");
  const [filterDistributor, setFilterDistributor] = useState("");

  // Fetch product history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const data = await getAllProdukHistory();
        setHistory(data);
        setErrorHistory(null);
      } catch (err) {
        setErrorHistory(
          err instanceof Error ? err.message : "Gagal memuat riwayat produk.",
        );
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const tanggalMasuk = new Date(item.tanggal_masuk);
      const tanggalAwal = filterTanggalAwal
        ? new Date(filterTanggalAwal)
        : null;
      const tanggalAkhir = filterTanggalAkhir
        ? new Date(filterTanggalAkhir)
        : null;

      if (tanggalAwal) {
        tanggalAwal.setHours(0, 0, 0, 0); // Start of the day
        if (tanggalMasuk < tanggalAwal) return false;
      }
      if (tanggalAkhir) {
        tanggalAkhir.setHours(23, 59, 59, 999); // End of the day
        if (tanggalMasuk > tanggalAkhir) return false;
      }

      if (
        filterProduk &&
        !item.nama_produk.toLowerCase().includes(filterProduk.toLowerCase()) &&
        !item.kode_produk.toLowerCase().includes(filterProduk.toLowerCase())
      ) {
        return false;
      }

      if (
        filterDistributor &&
        !item.distributor
          ?.toLowerCase()
          .includes(filterDistributor.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [
    history,
    filterTanggalAwal,
    filterTanggalAkhir,
    filterProduk,
    filterDistributor,
  ]);

  const handleResetFilter = () => {
    setFilterTanggalAwal("");
    setFilterTanggalAkhir("");
    setFilterProduk("");
    setFilterDistributor("");
  };

  // Handler untuk Export Laporan Harian PDF
  const handleExportBulananPDF = async () => {
    if (!tanggal) {
      alert("Silakan pilih tanggal!");
      return;
    }

    setLoadingBulanan(true);
    try {
      const params: LaporanBulananRequest = {
        tanggal,
      };

      const blob = await exportLaporanBulananPDF(params);
      const filename = `Laporan_Harian_${tanggal}.pdf`;
      downloadPDF(blob, filename);

      alert("Laporan harian berhasil diunduh!");
    } catch (error) {
      console.error("Error exporting harian PDF:", error);
      const err = error as { response?: { data?: { message?: string } } };
      alert(
        err.response?.data?.message ||
          "Gagal mengunduh laporan harian. Silakan coba lagi.",
      );
    } finally {
      setLoadingBulanan(false);
    }
  };

  // Handler untuk Lihat Laporan Laba Rugi
  const handleViewLabaRugi = async () => {
    if (!tanggalAwalLabaRugi || !tanggalAkhirLabaRugi) {
      alert("Silakan pilih tanggal awal dan akhir!");
      return;
    }

    setLoadingLabaRugi(true);
    try {
      const params: LaporanLabaRugiRequest = {
        tanggal_awal: tanggalAwalLabaRugi,
        tanggal_akhir: tanggalAkhirLabaRugi,
      };

      const response = await getLaporanLabaRugi(params);
      setDataLabaRugi(response);
    } catch (error) {
      console.error("Error fetching laporan laba rugi:", error);
      const err = error as { response?: { data?: { message?: string } } };
      alert(
        err.response?.data?.message ||
          "Gagal mengambil laporan laba rugi. Silakan coba lagi.",
      );
    } finally {
      setLoadingLabaRugi(false);
    }
  };

  // Handler untuk Export Laporan Laba Rugi PDF
  const handleExportLabaRugiPDF = async () => {
    if (!tanggalAwalLabaRugi || !tanggalAkhirLabaRugi) {
      alert("Silakan pilih tanggal awal dan akhir!");
      return;
    }

    setLoadingLabaRugi(true);
    try {
      const params: LaporanLabaRugiRequest = {
        tanggal_awal: tanggalAwalLabaRugi,
        tanggal_akhir: tanggalAkhirLabaRugi,
      };

      const blob = await exportLaporanLabaRugiPDF(params);
      const filename = `Laporan_Laba_Rugi_${tanggalAwalLabaRugi}_${tanggalAkhirLabaRugi}.pdf`;
      downloadPDF(blob, filename);

      alert("Laporan laba rugi berhasil diunduh!");
    } catch (error) {
      console.error("Error exporting laba rugi PDF:", error);
      const err = error as { response?: { data?: { message?: string } } };
      alert(
        err.response?.data?.message ||
          "Gagal mengunduh laporan laba rugi. Silakan coba lagi.",
      );
    } finally {
      setLoadingLabaRugi(false);
    }
  };

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Laporan</h3>
            <p className="text-subtitle text-muted">
              Export laporan dan lihat riwayat data
            </p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="row">
          {/* Laporan Harian */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Laporan Harian</h4>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Tanggal</label>
                  <input
                    type="date"
                    className="form-control"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-success w-100"
                  onClick={handleExportBulananPDF}
                  disabled={loadingBulanan || !tanggal}
                >
                  {loadingBulanan ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Mengunduh...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-file-pdf me-2"></i>
                      Export PDF Harian
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Laporan Laba Rugi */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Laporan Laba Rugi</h4>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Tanggal Awal</label>
                  <input
                    type="date"
                    className="form-control"
                    value={tanggalAwalLabaRugi}
                    onChange={(e) => setTanggalAwalLabaRugi(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tanggal Akhir</label>
                  <input
                    type="date"
                    className="form-control"
                    value={tanggalAkhirLabaRugi}
                    onChange={(e) => setTanggalAkhirLabaRugi(e.target.value)}
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleViewLabaRugi}
                    disabled={
                      loadingLabaRugi ||
                      !tanggalAwalLabaRugi ||
                      !tanggalAkhirLabaRugi
                    }
                  >
                    {loadingLabaRugi ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Memuat...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-eye me-2"></i>
                        Lihat Laporan
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={handleExportLabaRugiPDF}
                    disabled={
                      loadingLabaRugi ||
                      !tanggalAwalLabaRugi ||
                      !tanggalAkhirLabaRugi
                    }
                  >
                    <i className="bi bi-file-pdf me-2"></i>
                    Export PDF
                  </button>
                </div>

                {/* Display Laba Rugi Data */}
                {dataLabaRugi && (
                  <div className="mt-4">
                    <hr />
                    <h5 className="mb-3">Hasil Laporan</h5>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <td className="fw-bold">Periode</td>
                            <td>
                              {new Date(
                                dataLabaRugi.data.periode.tanggal_awal,
                              ).toLocaleDateString("id-ID")}{" "}
                              -{" "}
                              {new Date(
                                dataLabaRugi.data.periode.tanggal_akhir,
                              ).toLocaleDateString("id-ID")}
                            </td>
                          </tr>
                          <tr className="table-success">
                            <td className="fw-bold">Total Pendapatan</td>
                            <td className="fw-bold">
                              Rp{" "}
                              {dataLabaRugi.data.pendapatan.total_pendapatan_bersih.toLocaleString(
                                "id-ID",
                              )}
                            </td>
                          </tr>
                          <tr className="table-danger">
                            <td className="fw-bold">Total HPP</td>
                            <td className="fw-bold">
                              Rp{" "}
                              {dataLabaRugi.data.harga_pokok_penjualan.total_hpp.toLocaleString(
                                "id-ID",
                              )}
                            </td>
                          </tr>
                          <tr className="table-info">
                            <td className="fw-bold">Laba Kotor</td>
                            <td className="fw-bold">
                              Rp{" "}
                              {dataLabaRugi.data.laba_rugi.laba_kotor.toLocaleString(
                                "id-ID",
                              )}
                              <span className="badge bg-info ms-2">
                                {dataLabaRugi.data.laba_rugi.persentase_laba_kotor.toFixed(
                                  2,
                                )}
                                %
                              </span>
                            </td>
                          </tr>
                          <tr className="table-primary">
                            <td className="fw-bold">Laba Bersih</td>
                            <td className="fw-bold">
                              Rp{" "}
                              {dataLabaRugi.data.laba_rugi.laba_bersih.toLocaleString(
                                "id-ID",
                              )}
                              <span className="badge bg-primary ms-2">
                                {dataLabaRugi.data.laba_rugi.persentase_laba_bersih.toFixed(
                                  2,
                                )}
                                %
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Produk Masuk */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Riwayat Produk Masuk</h4>
              </div>
              <div className="card-body">
                {/* Filter UI */}
                <div className="row mb-4">
                  <div className="col-md-3">
                    <label className="form-label">Dari Tanggal</label>
                    <input
                      type="date"
                      className="form-control"
                      value={filterTanggalAwal}
                      onChange={(e) => setFilterTanggalAwal(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Sampai Tanggal</label>
                    <input
                      type="date"
                      className="form-control"
                      value={filterTanggalAkhir}
                      onChange={(e) => setFilterTanggalAkhir(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Produk</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama/Kode Produk..."
                      value={filterProduk}
                      onChange={(e) => setFilterProduk(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Distributor</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nama Distributor..."
                      value={filterDistributor}
                      onChange={(e) => setFilterDistributor(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-12 d-flex justify-content-end">
                    <button
                      className="btn btn-secondary"
                      onClick={handleResetFilter}
                    >
                      <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
                      Filter
                    </button>
                  </div>
                </div>

                {loadingHistory ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : errorHistory ? (
                  <div className="alert alert-danger">{errorHistory}</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama Produk</th>
                          <th>Kode Produk</th>
                          <th>Stok Masuk</th>
                          <th>Satuan</th>
                          <th>Distributor</th>
                          <th>Tanggal Masuk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHistory.length > 0 ? (
                          filteredHistory.map((item, index) => (
                            <tr key={item.id}>
                              <td>{index + 1}</td>
                              <td>{item.nama_produk}</td>
                              <td>
                                <code>{item.kode_produk}</code>
                              </td>
                              <td>{item.stok}</td>
                              <td>{item.satuan.nama_satuan}</td>
                              <td>{item.distributor || "-"}</td>
                              <td>
                                {new Date(item.tanggal_masuk).toLocaleString(
                                  "id-ID",
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center">
                              Tidak ada data yang cocok dengan filter.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LaporanPage;
