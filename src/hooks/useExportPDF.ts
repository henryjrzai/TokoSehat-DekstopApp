import { useState } from "react";
import {
  exportLaporanPeriodePDF,
  exportLaporanBulananPDF,
  exportLaporanProdukTerlarisPDF,
  downloadPDF,
  getNamaBulan,
} from "../services/laporanService";

/**
 * Hook kustom untuk export PDF dengan error handling dan loading state
 */
export const useExportPDF = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportPeriodePDF = async (
    tanggal_awal: string,
    tanggal_akhir: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const blob = await exportLaporanPeriodePDF({
        tanggal_awal,
        tanggal_akhir,
      });
      const filename = `Laporan_Periode_${tanggal_awal}_${tanggal_akhir}.pdf`;
      downloadPDF(blob, filename);
      return true;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Gagal export PDF");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const exportBulananPDF = async (bulan: number, tahun: number) => {
    setLoading(true);
    setError(null);

    try {
      const blob = await exportLaporanBulananPDF({ bulan, tahun });
      const filename = `Laporan_Bulanan_${getNamaBulan(bulan)}_${tahun}.pdf`;
      downloadPDF(blob, filename);
      return true;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Gagal export PDF");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const exportProdukTerlarisPDF = async (
    tanggal_awal: string,
    tanggal_akhir: string,
    limit?: number
  ) => {
    setLoading(true);
    setError(null);

    try {
      const blob = await exportLaporanProdukTerlarisPDF({
        tanggal_awal,
        tanggal_akhir,
        limit,
      });
      const filename = `Laporan_Produk_Terlaris_${tanggal_awal}_${tanggal_akhir}.pdf`;
      downloadPDF(blob, filename);
      return true;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Gagal export PDF");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    exportPeriodePDF,
    exportBulananPDF,
    exportProdukTerlarisPDF,
  };
};
