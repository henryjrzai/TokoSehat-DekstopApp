# Implementasi Dashboard dengan Statistik

## Overview

Dashboard telah diperbarui dengan menampilkan data statistik lengkap yang menarik data dari API backend. Dashboard menampilkan berbagai metrik dan visualisasi chart untuk memberikan insight tentang performa toko.

## Fitur Dashboard

### 1. Statistik Cards

Menampilkan ringkasan data transaksi dalam periode:

- **Hari Ini**: Total transaksi dan pendapatan hari ini
- **Minggu Ini**: Total transaksi dan pendapatan minggu ini
- **Bulan Ini**: Total transaksi dan pendapatan bulan ini
- **Tahun Ini**: Total transaksi dan pendapatan tahun ini

**API Endpoint**: `GET /api/statistik/dashboard`

### 2. Statistik Inventori

Menampilkan informasi inventori:

- Total Produk
- Total Kategori
- Produk dengan Stok Menipis

**API Endpoint**: `GET /api/statistik/dashboard`

### 3. Chart Perbandingan Penjualan (Bar Chart)

Membandingkan penjualan antara periode:

- Hari Ini vs Minggu Ini vs Bulan Ini vs Tahun Ini
- Menampilkan jumlah transaksi dan total pendapatan

**API Endpoint**: `GET /api/statistik/comparison`

### 4. Chart Penjualan Tahunan (Line Chart)

Menampilkan trend penjualan per bulan dalam tahun berjalan.

**API Endpoint**: `GET /api/statistik/tahunan?tahun=2025`

### 5. Chart Penjualan Bulanan (Line Chart)

Menampilkan trend penjualan per hari dalam bulan berjalan.

**API Endpoint**: `GET /api/statistik/bulanan?bulan=10&tahun=2025`

### 6. Chart Penjualan Mingguan (Bar Chart)

Menampilkan trend penjualan 7 hari terakhir.

**API Endpoint**: `GET /api/statistik/mingguan`

## File Structure

```
src/
├── components/
│   ├── ApexChartComponent.tsx    # Komponen chart menggunakan ApexCharts
│   └── ChartComponent.tsx         # Komponen chart menggunakan Chart.js (alternatif)
├── hooks/
│   └── useDashboard.ts            # Custom hook untuk fetch data dashboard
├── services/
│   └── dashboardService.ts        # Service untuk API calls statistik
└── pages/
    └── Home.tsx                   # Halaman dashboard utama
```

## Komponen Utama

### 1. dashboardService.ts

Service yang menangani semua API calls untuk statistik:

```typescript
// Fungsi-fungsi yang tersedia:
- getDashboardStats()         // Ambil statistik cards & inventory
- getComparisonStats()         // Ambil data comparison chart
- getYearlyStats(tahun?)       // Ambil data chart tahunan
- getMonthlyStats(bulan?, tahun?) // Ambil data chart bulanan
- getWeeklyStats(tanggal_akhir?)  // Ambil data chart mingguan
```

### 2. useDashboard.ts

Custom hook yang mengelola state dan fetching data:

```typescript
const {
  dashboardStats, // Data statistik cards & inventory
  comparisonData, // Data untuk comparison chart
  yearlyData, // Data untuk yearly chart
  monthlyData, // Data untuk monthly chart
  weeklyData, // Data untuk weekly chart
  loading, // Status loading
  error, // Error message
  refreshDashboard, // Fungsi untuk refresh data
} = useDashboard();
```

### 3. ApexChartComponent.tsx

Komponen reusable untuk menampilkan chart dengan ApexCharts:

```typescript
<ApexChartComponent
  data={chartData}
  type="bar" | "line" | "area"
  height={300}
  title="Chart Title"
/>
```

**Props:**

- `data`: Data chart dalam format Chart.js (akan dikonversi otomatis)
- `type`: Tipe chart (bar, line, atau area)
- `height`: Tinggi chart dalam pixel
- `title`: Judul chart (optional)

## Library yang Digunakan

### ApexCharts

Dashboard menggunakan **ApexCharts** yang sudah tersedia di:

```
/public/assets/vendors/apexcharts/apexcharts.min.js
```

ApexCharts dipilih karena:

- Mudah diintegrasikan dengan React
- Memiliki animasi yang smooth
- Responsive dan mobile-friendly
- Kompatibel dengan Electron
- Tidak perlu instalasi npm package tambahan

## Cara Kerja

1. **Saat halaman dimuat**:

   - Script ApexCharts dimuat dari public assets
   - Hook `useDashboard` akan fetch semua data statistik secara parallel
   - Loading state ditampilkan saat data sedang dimuat

2. **Menampilkan data**:

   - Data statistik ditampilkan dalam cards
   - Chart dirender menggunakan ApexChartComponent
   - Data inventory ditampilkan dalam section terpisah

3. **Refresh data**:
   - User dapat klik tombol "Refresh" untuk memuat ulang data
   - Semua data akan di-fetch ulang dari API

## Format Data API

### Dashboard Stats Response

```json
{
  "status": true,
  "message": "Dashboard statistik berhasil diambil.",
  "data": {
    "cards": {
      "hari_ini": {
        "total_transaksi": 10,
        "total_pendapatan": 500000
      },
      "minggu_ini": { ... },
      "bulan_ini": { ... },
      "tahun_ini": { ... }
    },
    "inventory": {
      "total_produk": "150",
      "total_kategori": "10",
      "produk_stok_menipis": "5"
    }
  }
}
```

### Chart Data Response

```json
{
  "status": true,
  "message": "Statistik berhasil diambil.",
  "chart_data": {
    "labels": ["Label 1", "Label 2", ...],
    "datasets": [
      {
        "label": "Jumlah Transaksi",
        "data": [10, 20, 30, ...],
        "backgroundColor": "rgba(54, 162, 235, 0.5)",
        "borderColor": "rgba(54, 162, 235, 1)",
        "borderWidth": 2
      },
      {
        "label": "Total Pendapatan (Rp)",
        "data": [100000, 200000, 300000, ...],
        "backgroundColor": "rgba(75, 192, 192, 0.5)",
        "borderColor": "rgba(75, 192, 192, 1)",
        "borderWidth": 2,
        "yAxisID": "y1"
      }
    ]
  }
}
```

## Styling

Dashboard menggunakan Bootstrap dan Iconly icons yang sudah tersedia di template:

- Cards menggunakan class Bootstrap untuk responsive grid
- Icons menggunakan Iconly dan Bootstrap Icons
- Color scheme menggunakan warna default template (purple, blue, green, red)

## Error Handling

- Jika API error, akan ditampilkan alert message dengan tombol reload
- Loading state ditampilkan saat data sedang dimuat
- Jika tidak ada data, chart tidak akan ditampilkan

## Pengembangan Lebih Lanjut

Beberapa fitur yang bisa ditambahkan:

1. Filter tanggal untuk chart
2. Export chart ke PDF/Image
3. Dropdown untuk memilih periode (tahun, bulan)
4. Real-time update dengan WebSocket
5. Animasi saat data berubah
6. Perbandingan periode (YoY, MoM)
7. Drill-down untuk melihat detail transaksi

## Testing

Untuk testing dashboard:

1. Pastikan backend API berjalan di `http://kasir-toko-sehat-ws.test`
2. Pastikan user sudah login
3. Buka halaman Home/Dashboard
4. Periksa semua chart dan cards muncul dengan benar
5. Test tombol refresh untuk memastikan data ter-update

## Troubleshooting

### Chart tidak muncul

- Periksa console browser untuk error
- Pastikan ApexCharts script terload dengan benar
- Periksa response API apakah data sudah sesuai format

### Data tidak muncul

- Periksa network tab untuk melihat response API
- Pastikan token authentication valid
- Periksa error di console

### Loading terus-menerus

- Periksa apakah API endpoint accessible
- Periksa error di console
- Pastikan CORS settings sudah benar di backend
