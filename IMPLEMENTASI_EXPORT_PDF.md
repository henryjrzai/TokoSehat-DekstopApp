# Implementasi Export Laporan PDF

Dokumentasi implementasi untuk export laporan transaksi ke PDF berdasarkan API.

## 📁 File yang Dibuat

### 1. Service Layer

**File:** `src/services/laporanService.ts`

Service ini menyediakan fungsi-fungsi untuk berinteraksi dengan API laporan, termasuk:

#### Export PDF Functions:

- `exportLaporanPeriodePDF(params)` - Export laporan periode ke PDF
- `exportLaporanBulananPDF(params)` - Export laporan bulanan ke PDF
- `exportLaporanProdukTerlarisPDF(params)` - Export laporan produk terlaris ke PDF

#### Utility Functions:

- `downloadPDF(blob, filename)` - Helper untuk download PDF
- `formatDateForAPI(date)` - Format tanggal ke YYYY-MM-DD
- `getNamaBulan(bulan)` - Konversi nomor bulan ke nama bulan Indonesia

### 2. Page Component

**File:** `src/pages/Laporan/LaporanPage.tsx`

Halaman UI untuk export laporan dengan fitur:

- Form input periode (tanggal awal & akhir)
- Form input bulanan (bulan & tahun)
- Quick select untuk minggu ini dan bulan ini
- Loading state saat proses download
- Error handling

## 🚀 Cara Penggunaan

### 1. Import Service di Component

```typescript
import {
  exportLaporanPeriodePDF,
  exportLaporanBulananPDF,
  downloadPDF,
  formatDateForAPI,
  LaporanPeriodeRequest,
  LaporanBulananRequest,
} from "../../services/laporanService";
```

### 2. Export Laporan Periode PDF

```typescript
const handleExportPeriodePDF = async () => {
  try {
    const params: LaporanPeriodeRequest = {
      tanggal_awal: "2024-01-01",
      tanggal_akhir: "2024-01-31",
    };

    const blob = await exportLaporanPeriodePDF(params);
    const filename = `Laporan_Periode_${params.tanggal_awal}_${params.tanggal_akhir}.pdf`;
    downloadPDF(blob, filename);

    console.log("PDF berhasil diunduh!");
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### 3. Export Laporan Bulanan PDF

```typescript
const handleExportBulananPDF = async () => {
  try {
    const params: LaporanBulananRequest = {
      bulan: 10, // Oktober
      tahun: 2024,
    };

    const blob = await exportLaporanBulananPDF(params);
    const filename = `Laporan_Bulanan_Oktober_2024.pdf`;
    downloadPDF(blob, filename);

    console.log("PDF berhasil diunduh!");
  } catch (error) {
    console.error("Error:", error);
  }
};
```

## 📊 API Endpoints yang Digunakan

### 1. Export Laporan Periode PDF

```
POST /laporan/periode/pdf
Content-Type: application/json

Request Body:
{
  "tanggal_awal": "2024-01-01",
  "tanggal_akhir": "2024-01-31"
}

Response: Binary (PDF Blob)
```

### 2. Export Laporan Bulanan PDF

```
POST /laporan/bulanan/pdf
Content-Type: application/json

Request Body:
{
  "bulan": 10,
  "tahun": 2024
}

Response: Binary (PDF Blob)
```

## 🔧 Konfigurasi Axios

Service menggunakan `responseType: 'blob'` untuk menerima binary data:

```typescript
const response = await axiosInstance.post("/laporan/periode/pdf", params, {
  responseType: "blob", // Penting untuk PDF
});
```

## 📝 Interface & Types

### LaporanPeriodeRequest

```typescript
interface LaporanPeriodeRequest {
  tanggal_awal: string; // format: YYYY-MM-DD
  tanggal_akhir: string; // format: YYYY-MM-DD
}
```

### LaporanBulananRequest

```typescript
interface LaporanBulananRequest {
  bulan: number; // 1-12
  tahun: number;
}
```

## ✅ Fitur Lengkap

### Laporan Service (`laporanService.ts`) menyediakan:

1. **Export PDF:**

   - ✅ Export Laporan Periode PDF
   - ✅ Export Laporan Bulanan PDF
   - ✅ Export Laporan Produk Terlaris PDF

2. **Get Data Laporan:**

   - ✅ Get Laporan Periode
   - ✅ Get Laporan Bulanan
   - ✅ Get Laporan Produk Terlaris

3. **Statistik Dashboard:**

   - ✅ Get Dashboard Statistik
   - ✅ Get Statistik Comparison
   - ✅ Get Statistik Tahunan
   - ✅ Get Statistik Bulanan
   - ✅ Get Statistik Mingguan

4. **Utility Functions:**
   - ✅ Download PDF helper
   - ✅ Format date for API
   - ✅ Get nama bulan Indonesia

## 🎨 UI Component Features

### Laporan Page (`LaporanPage.tsx`) menyediakan:

1. **Form Laporan Periode:**

   - Input tanggal awal
   - Input tanggal akhir
   - Quick select: Minggu Ini, Bulan Ini
   - Button export dengan loading state

2. **Form Laporan Bulanan:**

   - Select bulan (dropdown)
   - Input tahun
   - Button export dengan loading state

3. **Error Handling:**

   - Validasi input
   - Alert untuk error
   - Alert untuk sukses

4. **Loading States:**
   - Spinner saat proses download
   - Disable button saat loading

## 🔐 Authentication

Semua endpoint laporan memerlukan authentication token yang sudah dikonfigurasi di `axios.ts`:

```typescript
// Token otomatis ditambahkan oleh axios interceptor
Authorization: Bearer {token}
```

## 📱 Contoh Penggunaan di Component Lain

### Minimal Example:

```typescript
import {
  exportLaporanPeriodePDF,
  downloadPDF,
} from "@/services/laporanService";

const MyComponent = () => {
  const handleDownload = async () => {
    try {
      const blob = await exportLaporanPeriodePDF({
        tanggal_awal: "2024-10-01",
        tanggal_akhir: "2024-10-31",
      });

      downloadPDF(blob, "Laporan_Oktober_2024.pdf");
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={handleDownload}>Download Laporan</button>;
};
```

### Advanced Example with State Management:

```typescript
import { useState } from "react";
import {
  exportLaporanBulananPDF,
  downloadPDF,
  getNamaBulan,
} from "@/services/laporanService";

const AdvancedComponent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async (bulan: number, tahun: number) => {
    setLoading(true);
    setError(null);

    try {
      const blob = await exportLaporanBulananPDF({ bulan, tahun });
      const filename = `Laporan_${getNamaBulan(bulan)}_${tahun}.pdf`;
      downloadPDF(blob, filename);

      alert("Laporan berhasil diunduh!");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Gagal mengunduh laporan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error}</div>}

      <button onClick={() => handleDownload(10, 2024)} disabled={loading}>
        {loading ? "Mengunduh..." : "Download Laporan"}
      </button>
    </div>
  );
};
```

## 🧪 Testing

### Test Export Periode:

```typescript
// Test dengan periode minggu ini
const now = new Date();
const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

await exportLaporanPeriodePDF({
  tanggal_awal: formatDateForAPI(startOfWeek),
  tanggal_akhir: formatDateForAPI(endOfWeek),
});
```

### Test Export Bulanan:

```typescript
// Test dengan bulan ini
const now = new Date();
await exportLaporanBulananPDF({
  bulan: now.getMonth() + 1,
  tahun: now.getFullYear(),
});
```

## ⚠️ Error Handling

Service akan throw error jika:

- Network error
- API error (401, 404, 422, 500)
- Invalid parameters

Contoh error handling:

```typescript
try {
  const blob = await exportLaporanPeriodePDF(params);
  downloadPDF(blob, filename);
} catch (error) {
  const err = error as { response?: { data?: { message?: string } } };

  if (err.response?.status === 401) {
    console.error("Unauthorized - silakan login kembali");
  } else if (err.response?.status === 404) {
    console.error("Data tidak ditemukan");
  } else if (err.response?.status === 422) {
    console.error("Validasi error:", err.response?.data?.message);
  } else {
    console.error("Error:", err.response?.data?.message);
  }
}
```

## 📦 Dependencies

Pastikan packages berikut sudah terinstall:

- `axios` - untuk HTTP requests
- `react` - untuk UI components

## 🎯 Next Steps

Untuk mengintegrasikan ke aplikasi:

1. **Tambahkan route di router:**

```typescript
import LaporanPage from './pages/Laporan/LaporanPage';

// Di router config
{
  path: '/laporan',
  element: <LaporanPage />
}
```

2. **Tambahkan menu di sidebar:**

```tsx
<li>
  <a href="/laporan">
    <i className="bi bi-file-earmark-pdf"></i>
    <span>Laporan PDF</span>
  </a>
</li>
```

3. **Custom styling (optional):**
   Sesuaikan styling di LaporanPage.tsx sesuai design system aplikasi.

## 📚 Referensi

- API Documentation: `doc-api.json`
- Axios Config: `src/config/axios.ts`
- Base URL: Sesuai konfigurasi di axios instance

---

**Dibuat:** Oktober 2024  
**Status:** ✅ Ready to use  
**Version:** 1.0.0
