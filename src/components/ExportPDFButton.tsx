import { useState } from "react";
import {
  exportLaporanPeriodePDF,
  exportLaporanBulananPDF,
  exportLaporanProdukTerlarisPDF,
  downloadPDF,
  formatDateForAPI,
  getNamaBulan,
} from "../services/laporanService";

/**
 * Komponen untuk tombol export PDF dengan handling lengkap
 */
interface ExportPDFButtonProps {
  type: "periode" | "bulanan" | "produk-terlaris";
  params?: Record<string, string | number>;
  label?: string;
  className?: string;
}

export const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({
  type,
  params = {},
  label,
  className = "btn btn-primary",
}) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);

    try {
      let blob: Blob;
      let filename: string;

      switch (type) {
        case "periode": {
          const { tanggal_awal, tanggal_akhir } = params as {
            tanggal_awal: string;
            tanggal_akhir: string;
          };
          blob = await exportLaporanPeriodePDF({
            tanggal_awal,
            tanggal_akhir,
          });
          filename = `Laporan_Periode_${tanggal_awal}_${tanggal_akhir}.pdf`;
          break;
        }

        case "bulanan": {
          const { bulan, tahun } = params as { bulan: number; tahun: number };
          blob = await exportLaporanBulananPDF({ bulan, tahun });
          filename = `Laporan_Bulanan_${getNamaBulan(bulan)}_${tahun}.pdf`;
          break;
        }

        case "produk-terlaris": {
          const { tanggal_awal, tanggal_akhir, limit } = params as {
            tanggal_awal: string;
            tanggal_akhir: string;
            limit?: number;
          };
          blob = await exportLaporanProdukTerlarisPDF({
            tanggal_awal,
            tanggal_akhir,
            limit,
          });
          filename = `Laporan_Produk_Terlaris_${tanggal_awal}_${tanggal_akhir}.pdf`;
          break;
        }

        default:
          throw new Error("Invalid export type");
      }

      downloadPDF(blob, filename);
      alert("Laporan berhasil diunduh!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || "Gagal mengunduh laporan PDF");
    } finally {
      setLoading(false);
    }
  };

  const defaultLabels = {
    periode: "Export PDF Periode",
    bulanan: "Export PDF Bulanan",
    "produk-terlaris": "Export PDF Produk Terlaris",
  };

  return (
    <button className={className} onClick={handleExport} disabled={loading}>
      {loading ? (
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
          {label || defaultLabels[type]}
        </>
      )}
    </button>
  );
};

/**
 * Contoh penggunaan ExportPDFButton
 */
export const ExportPDFExamples = () => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return (
    <div className="container mt-4">
      <h4>Contoh Penggunaan Export PDF</h4>

      {/* Export Periode - Bulan Ini */}
      <div className="mb-3">
        <h6>1. Export Laporan Periode (Bulan Ini)</h6>
        <ExportPDFButton
          type="periode"
          params={{
            tanggal_awal: formatDateForAPI(startOfMonth),
            tanggal_akhir: formatDateForAPI(endOfMonth),
          }}
        />
      </div>

      {/* Export Bulanan */}
      <div className="mb-3">
        <h6>2. Export Laporan Bulanan (Oktober 2024)</h6>
        <ExportPDFButton
          type="bulanan"
          params={{
            bulan: 10,
            tahun: 2024,
          }}
          className="btn btn-success"
        />
      </div>

      {/* Export Produk Terlaris */}
      <div className="mb-3">
        <h6>3. Export Produk Terlaris (30 Hari Terakhir)</h6>
        <ExportPDFButton
          type="produk-terlaris"
          params={{
            tanggal_awal: formatDateForAPI(
              new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
            ),
            tanggal_akhir: formatDateForAPI(today),
            limit: 10,
          }}
          className="btn btn-warning"
        />
      </div>
    </div>
  );
};
