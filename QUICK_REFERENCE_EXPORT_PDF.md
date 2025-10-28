# Quick Reference - Export PDF Laporan

## 🚀 Cara Cepat Menggunakan

### 1. Import di Component

```typescript
import {
  exportLaporanPeriodePDF,
  exportLaporanBulananPDF,
  downloadPDF,
} from "@/services/laporanService";
```

### 2. Export Laporan Periode

```typescript
const handleExport = async () => {
  try {
    const blob = await exportLaporanPeriodePDF({
      tanggal_awal: "2024-10-01",
      tanggal_akhir: "2024-10-31",
    });
    downloadPDF(blob, "Laporan_Oktober.pdf");
  } catch (error) {
    console.error(error);
  }
};
```

### 3. Export Laporan Bulanan

```typescript
const handleExport = async () => {
  try {
    const blob = await exportLaporanBulananPDF({
      bulan: 10,
      tahun: 2024,
    });
    downloadPDF(blob, "Laporan_Bulanan_Oktober.pdf");
  } catch (error) {
    console.error(error);
  }
};
```

## 📦 Files Created

| File                                   | Description                                  |
| -------------------------------------- | -------------------------------------------- |
| `src/services/laporanService.ts`       | Service utama dengan semua fungsi export PDF |
| `src/pages/Laporan/LaporanPage.tsx`    | Halaman UI lengkap untuk export laporan      |
| `src/components/ExportPDFButton.tsx`   | Reusable button component                    |
| `src/components/ExportPDFWithHook.tsx` | Contoh penggunaan hook                       |
| `src/hooks/useExportPDF.ts`            | Custom hook untuk export PDF                 |
| `IMPLEMENTASI_EXPORT_PDF.md`           | Dokumentasi lengkap                          |

## 🎯 3 Ways to Use

### A. Langsung Panggil Function

```typescript
import {
  exportLaporanPeriodePDF,
  downloadPDF,
} from "@/services/laporanService";

const blob = await exportLaporanPeriodePDF({
  tanggal_awal: "2024-01-01",
  tanggal_akhir: "2024-01-31",
});
downloadPDF(blob, "laporan.pdf");
```

### B. Pakai Component

```tsx
import { ExportPDFButton } from "@/components/ExportPDFButton";

<ExportPDFButton
  type="periode"
  params={{
    tanggal_awal: "2024-10-01",
    tanggal_akhir: "2024-10-31",
  }}
/>;
```

### C. Pakai Hook

```typescript
import { useExportPDF } from "@/hooks/useExportPDF";

const { loading, error, exportPeriodePDF } = useExportPDF();

const handleExport = async () => {
  const success = await exportPeriodePDF("2024-10-01", "2024-10-31");
  if (success) alert("Berhasil!");
};
```

## 🔥 Available Functions

### Export PDF

- ✅ `exportLaporanPeriodePDF(params)` - Export periode
- ✅ `exportLaporanBulananPDF(params)` - Export bulanan
- ✅ `exportLaporanProdukTerlarisPDF(params)` - Export produk terlaris

### Get Data

- ✅ `getLaporanPeriode(params)` - Get data periode
- ✅ `getLaporanBulanan(params)` - Get data bulanan
- ✅ `getLaporanProdukTerlaris(params)` - Get produk terlaris

### Utilities

- ✅ `downloadPDF(blob, filename)` - Download file
- ✅ `formatDateForAPI(date)` - Format tanggal
- ✅ `getNamaBulan(bulan)` - Nama bulan Indonesia

## 📋 Parameter Reference

### Laporan Periode

```typescript
{
  tanggal_awal: string; // "YYYY-MM-DD"
  tanggal_akhir: string; // "YYYY-MM-DD"
}
```

### Laporan Bulanan

```typescript
{
  bulan: number; // 1-12
  tahun: number; // 2024
}
```

### Produk Terlaris

```typescript
{
  tanggal_awal: string;
  tanggal_akhir: string;
  limit?: number;  // default: 10
}
```

## ⚡ Quick Examples

### Export Bulan Ini

```typescript
import {
  formatDateForAPI,
  exportLaporanPeriodePDF,
  downloadPDF,
} from "@/services/laporanService";

const now = new Date();
const start = new Date(now.getFullYear(), now.getMonth(), 1);
const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

const blob = await exportLaporanPeriodePDF({
  tanggal_awal: formatDateForAPI(start),
  tanggal_akhir: formatDateForAPI(end),
});

downloadPDF(blob, "Laporan_Bulan_Ini.pdf");
```

### Export Tahun Ini

```typescript
const blob = await exportLaporanBulananPDF({
  bulan: new Date().getMonth() + 1,
  tahun: new Date().getFullYear(),
});

downloadPDF(blob, "Laporan_Tahun_Ini.pdf");
```

## ✅ Status

- [x] Service layer created
- [x] Export Periode PDF ✅
- [x] Export Bulanan PDF ✅
- [x] UI Page created
- [x] Reusable components
- [x] Custom hooks
- [x] Documentation
- [x] No TypeScript errors

## 📚 Docs

Lihat `IMPLEMENTASI_EXPORT_PDF.md` untuk dokumentasi lengkap.
