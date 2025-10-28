import { useState } from "react";
import {
  // exportLaporanPeriodePDF,
  exportLaporanBulananPDF,
  downloadPDF,
  // formatDateForAPI,
  getNamaBulan,
  // LaporanPeriodeRequest,
  LaporanBulananRequest,
} from "../../services/laporanService";

const LaporanPage = () => {
  // State for Laporan Periode
  // const [periodeStart, setPeriodeStart] = useState("");
  // const [periodeEnd, setPeriodeEnd] = useState("");
  // const [loadingPeriode, setLoadingPeriode] = useState(false);

  // State for Laporan Bulanan
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [loadingBulanan, setLoadingBulanan] = useState(false);

  // Handler untuk Export Laporan Periode PDF
  // const handleExportPeriodePDF = async () => {
  //   if (!periodeStart || !periodeEnd) {
  //     alert("Silakan pilih tanggal awal dan akhir periode!");
  //     return;
  //   }

  //   setLoadingPeriode(true);
  //   try {
  //     const params: LaporanPeriodeRequest = {
  //       tanggal_awal: periodeStart,
  //       tanggal_akhir: periodeEnd,
  //     };

  //     const blob = await exportLaporanPeriodePDF(params);
  //     const filename = `Laporan_Periode_${periodeStart}_${periodeEnd}.pdf`;
  //     downloadPDF(blob, filename);

  //     alert("Laporan periode berhasil diunduh!");
  //   } catch (error) {
  //     console.error("Error exporting periode PDF:", error);
  //     const err = error as { response?: { data?: { message?: string } } };
  //     alert(
  //       err.response?.data?.message ||
  //         "Gagal mengunduh laporan periode. Silakan coba lagi."
  //     );
  //   } finally {
  //     setLoadingPeriode(false);
  //   }
  // };

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

  // Set default dates (contoh: bulan ini)
  // const setCurrentMonth = () => {
  //   const now = new Date();
  //   const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  //   const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  //   setPeriodeStart(formatDateForAPI(firstDay));
  //   setPeriodeEnd(formatDateForAPI(lastDay));
  // };

  // Set default dates (contoh: minggu ini)
  // const setCurrentWeek = () => {
  //   const now = new Date();
  //   const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
  //   const lastDay = new Date(now.setDate(now.getDate() - now.getDay() + 6));

  //   setPeriodeStart(formatDateForAPI(firstDay));
  //   setPeriodeEnd(formatDateForAPI(lastDay));
  // };

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Laporan Transaksi</h3>
            <p className="text-subtitle text-muted">
              Export laporan transaksi ke PDF
            </p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="row">
          {/* Laporan Periode */}
          {/* <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Laporan Periode</h4>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Tanggal Awal</label>
                  <input
                    type="date"
                    className="form-control"
                    value={periodeStart}
                    onChange={(e) => setPeriodeStart(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tanggal Akhir</label>
                  <input
                    type="date"
                    className="form-control"
                    value={periodeEnd}
                    onChange={(e) => setPeriodeEnd(e.target.value)}
                  />
                </div>

                <div className="mb-3 d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={setCurrentWeek}
                  >
                    Minggu Ini
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={setCurrentMonth}
                  >
                    Bulan Ini
                  </button>
                </div>

                <button
                  className="btn btn-primary w-100"
                  onClick={handleExportPeriodePDF}
                  disabled={loadingPeriode || !periodeStart || !periodeEnd}
                >
                  {loadingPeriode ? (
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
                      Export PDF Periode
                    </>
                  )}
                </button>
              </div>
            </div>
          </div> */}

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

        {/* Informasi */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-info-circle me-2"></i>Informasi
                </h5>
                <ul className="mb-0">
                  {/* <li>
                    <strong>Laporan Periode:</strong> Export laporan transaksi
                    berdasarkan rentang tanggal yang dipilih
                  </li> */}
                  <li>
                    <strong>Laporan Bulanan:</strong> Export laporan transaksi
                    untuk bulan dan tahun tertentu
                  </li>
                  <li>
                    File PDF akan otomatis terunduh setelah proses selesai
                  </li>
                  <li>
                    Pastikan koneksi internet stabil saat mengunduh laporan
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LaporanPage;
