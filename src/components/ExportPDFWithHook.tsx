import { useExportPDF } from "../hooks/useExportPDF";

/**
 * Contoh komponen yang menggunakan useExportPDF hook
 */
export const ExportPDFWithHook = () => {
  const { loading, error, exportPeriodePDF, exportBulananPDF } = useExportPDF();

  const handleExportPeriode = async () => {
    const success = await exportPeriodePDF("2024-10-01", "2024-10-31");
    if (success) {
      alert("Laporan periode berhasil diunduh!");
    }
  };

  const handleExportBulanan = async () => {
    const success = await exportBulananPDF(10, 2024);
    if (success) {
      alert("Laporan bulanan berhasil diunduh!");
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5>Export dengan Custom Hook</h5>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={handleExportPeriode}
            disabled={loading}
          >
            {loading ? "Loading..." : "Export Periode"}
          </button>

          <button
            className="btn btn-success"
            onClick={handleExportBulanan}
            disabled={loading}
          >
            {loading ? "Loading..." : "Export Bulanan"}
          </button>
        </div>
      </div>
    </div>
  );
};
