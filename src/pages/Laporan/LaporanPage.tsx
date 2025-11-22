import { useState, useEffect, useMemo } from "react";
import {
  exportLaporanBulananPDF,
  downloadPDF,
  getNamaBulan,
  LaporanBulananRequest,
} from "../../services/laporanService";
import {
  getAllProdukHistory,
  AllProdukHistoryItem,
} from "../../services/produkService";

const LaporanPage = () => {
  // State for Laporan Bulanan
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [loadingBulanan, setLoadingBulanan] = useState(false);

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
          err instanceof Error
            ? err.message
            : "Gagal memuat riwayat produk."
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
  }, [history, filterTanggalAwal, filterTanggalAkhir, filterProduk, filterDistributor]);

  const handleResetFilter = () => {
    setFilterTanggalAwal("");
    setFilterTanggalAkhir("");
    setFilterProduk("");
    setFilterDistributor("");
  };

  // Handler untuk Export Laporan Bulanan PDF
  const handleExportBulananPDF = async () => {
    if (!bulan || !tahun) {
      alert("Silakan pilih bulan dan tahun!");
      return;
    }

    setLoadingBulanan(true);
    try {
      const params: LaporanBulananRequest = {
        bulan,
        tahun,
      };

      const blob = await exportLaporanBulananPDF(params);
      const namaBulan = getNamaBulan(bulan);
      const filename = `Laporan_Bulanan_${namaBulan}_${tahun}.pdf`;
      downloadPDF(blob, filename);

      alert("Laporan bulanan berhasil diunduh!");
    } catch (error) {
      console.error("Error exporting bulanan PDF:", error);
      const err = error as { response?: { data?: { message?: string } } };
      alert(
        err.response?.data?.message ||
          "Gagal mengunduh laporan bulanan. Silakan coba lagi."
      );
    } finally {
      setLoadingBulanan(false);
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
          {/* Laporan Bulanan */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Laporan Bulanan</h4>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Bulan</label>
                  <select
                    className="form-select"
                    value={bulan}
                    onChange={(e) => setBulan(Number(e.target.value))}
                  >
                    <option value={1}>Januari</option>
                    <option value={2}>Februari</option>
                    <option value={3}>Maret</option>
                    <option value={4}>April</option>
                    <option value={5}>Mei</option>
                    <option value={6}>Juni</option>
                    <option value={7}>Juli</option>
                    <option value={8}>Agustus</option>
                    <option value={9}>September</option>
                    <option value={10}>Oktober</option>
                    <option value={11}>November</option>
                    <option value={12}>Desember</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Tahun</label>
                  <input
                    type="number"
                    className="form-control"
                    value={tahun}
                    onChange={(e) => setTahun(Number(e.target.value))}
                    min={2020}
                    max={2099}
                  />
                </div>

                <button
                  className="btn btn-success w-100"
                  onClick={handleExportBulananPDF}
                  disabled={loadingBulanan || !bulan || !tahun}
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
                      Export PDF Bulanan
                    </>
                  )}
                </button>
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
                    <button className="btn btn-secondary" onClick={handleResetFilter}>
                      <i className="bi bi-arrow-counterclockwise me-2"></i>Reset Filter
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
                              <td><code>{item.kode_produk}</code></td>
                              <td>{item.stok}</td>
                              <td>{item.satuan.nama_satuan}</td>
                              <td>{item.distributor || "-"}</td>
                              <td>{new Date(item.tanggal_masuk).toLocaleString("id-ID")}</td>
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
