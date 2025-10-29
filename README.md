# Toko Sehat Kabanjahe - Sistem Kasir Desktop

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript)
![Electron](https://img.shields.io/badge/Electron-30.0.1-47848F?logo=electron)

Sistem Kasir Desktop berbasis Electron untuk Toko Sehat Kabanjahe. Aplikasi ini dibangun menggunakan React, TypeScript, Vite, dan Electron untuk memberikan pengalaman desktop native dengan performa web modern.

## 📋 Daftar Isi

- [Tentang Sistem](#tentang-sistem)
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Cara Menjalankan](#cara-menjalankan)
- [Build untuk Produksi](#build-untuk-produksi)
- [Struktur Folder](#struktur-folder)
- [Dokumentasi](#dokumentasi)
- [Troubleshooting](#troubleshooting)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## 🎯 Tentang Sistem

**Toko Sehat Kabanjahe - Sistem Kasir** adalah aplikasi desktop yang dirancang khusus untuk membantu pengelolaan transaksi penjualan, inventory, dan laporan untuk toko retail. Sistem ini menyediakan antarmuka yang user-friendly dan fitur-fitur lengkap untuk operasional toko sehari-hari.

### Keunggulan Sistem:

✅ **Aplikasi Desktop Native** - Tidak perlu browser, aplikasi standalone  
✅ **Offline-Ready** - Dapat berjalan tanpa koneksi internet (dengan setup lokal)  
✅ **Fast Performance** - Dibangun dengan Vite untuk performa optimal  
✅ **Type-Safe** - Menggunakan TypeScript untuk mengurangi bug  
✅ **Responsive Design** - Tampilan menyesuaikan ukuran layar  
✅ **Modern UI** - Menggunakan Bootstrap 5 dengan desain clean  
✅ **Real-time Statistics** - Dashboard dengan statistik dan chart interaktif

## 🚀 Fitur Utama

### 1. **Manajemen Pengguna (User Management)**

- Login & Logout
- Role-based access (Admin & Kasir)
- Manajemen user (CRUD)
- Ganti password
- Profile user

### 2. **Dashboard Interaktif**

- **Statistics Cards**
  - Transaksi & Pendapatan Hari Ini
  - Transaksi & Pendapatan Minggu Ini
  - Transaksi & Pendapatan Bulan Ini
  - Transaksi & Pendapatan Tahun Ini
- **Inventory Statistics**
  - Total Produk
  - Total Kategori
  - Produk Stok Menipis
- **Interactive Charts** (ApexCharts)
  - Perbandingan Penjualan (Bar Chart)
  - Penjualan Tahunan per Bulan (Line Chart)
  - Penjualan Bulanan per Hari (Line Chart)
  - Penjualan Mingguan 7 Hari (Bar Chart)
- **Real-time Update** dengan tombol refresh

### 3. **Manajemen Produk**

- CRUD Produk (Create, Read, Update, Delete)
- Update stok produk
- Search produk by kode atau nama
- Kategori produk
- Satuan produk
- Harga jual & harga beli
- Tracking stok

### 4. **Manajemen Kategori Produk**

- CRUD Kategori
- Deskripsi kategori

### 5. **Manajemen Satuan**

- CRUD Satuan (pcs, box, pack, dll)

### 6. **Point of Sale (Kasir)**

- Interface kasir yang intuitif
- Input kode produk
- Keranjang belanja
- Perhitungan otomatis
- Cetak struk thermal
- Riwayat transaksi

### 7. **Transaksi**

- List semua transaksi
- Detail transaksi
- Cetak ulang struk
- Batalkan transaksi (restore stok)

### 8. **Laporan**

- **Laporan Periode**
  - Filter berdasarkan tanggal
  - Export ke PDF
- **Laporan Bulanan**
  - Filter per bulan & tahun
  - Export ke PDF
- **Laporan Produk Terlaris**
  - Top selling products
  - Export ke PDF

### 9. **Export PDF**

- Export laporan ke PDF
- Custom layout untuk thermal printer
- Watermark & branding

## 🛠️ Teknologi yang Digunakan

### Frontend

- **React 18.2** - UI Library
- **TypeScript 5.2** - Type-safe JavaScript
- **Vite 5.1** - Build tool & dev server
- **React Router DOM 7.9** - Routing
- **Axios 1.13** - HTTP Client

### Desktop

- **Electron 30.0** - Desktop framework
- **Electron Builder 24.13** - Package & distribute

### UI/UX

- **Bootstrap 5** - CSS Framework
- **Bootstrap Icons** - Icon library
- **Iconly** - Modern icons
- **ApexCharts** - Interactive charts

### Development Tools

- **ESLint** - Code linting
- **TypeScript ESLint** - TS-specific linting
- **Vite Plugin Electron** - Electron integration

## 📦 Prasyarat

Sebelum instalasi, pastikan sistem Anda memiliki:

### Required:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (included with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Backend API:

- Backend API harus sudah berjalan di `http://kasir-toko-sehat-ws.test/api`
- Dokumentasi API tersedia di file `doc-api.json`

### Operating System:

- Windows 10/11 (64-bit)
- macOS 10.13+
- Linux (Ubuntu 20.04+, Fedora 34+)

## 📥 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd toko-sehat
```

### 2. Install Dependencies

```bash
npm install
```

Ini akan menginstall semua dependencies yang diperlukan termasuk:

- React & React DOM
- TypeScript
- Vite
- Electron
- Axios
- React Router DOM
- Dan lainnya...

### 3. Konfigurasi Backend URL

Edit file `src/config/axios.ts` untuk mengatur base URL API:

```typescript
const axiosInstance = axios.create({
  baseURL: "http://kasir-toko-sehat-ws.test/api", // Sesuaikan dengan URL backend Anda
  headers: {
    "Content-Type": "application/json",
  },
});
```

### 4. Verifikasi Instalasi

Pastikan tidak ada error saat instalasi. Jika ada error, coba:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Install ulang
npm install
```

## 🚀 Cara Menjalankan

### Development Mode

Jalankan aplikasi dalam mode development dengan hot reload:

```bash
npm run dev
```

Aplikasi akan:

1. Start Vite dev server
2. Launch Electron window
3. Enable hot module replacement (HMR)

### Login Default

Setelah aplikasi berjalan, gunakan kredensial berikut untuk login:

- **Username**: (sesuai dengan database backend)
- **Password**: (sesuai dengan database backend)

Silakan hubungi administrator backend untuk kredensial login.

## 📦 Build untuk Produksi

### Build Aplikasi

Compile TypeScript dan build aplikasi:

```bash
npm run build
```

Ini akan:

1. Compile TypeScript files
2. Build React app dengan Vite
3. Package dengan Electron Builder
4. Menghasilkan executable file

### Output Build

Hasil build akan tersimpan di folder `dist/`:

```
dist/
├── win-unpacked/          # Windows unpacked files
├── toko-sehat Setup.exe   # Windows installer
├── mac/                   # macOS build (jika di macOS)
└── linux/                 # Linux build (jika di Linux)
```

### Platform-Specific Build

Build untuk platform tertentu:

```bash
# Windows
npm run build -- --win

# macOS
npm run build -- --mac

# Linux
npm run build -- --linux
```

## 📁 Struktur Folder

```
toko-sehat/
├── dist-electron/              # Compiled Electron files
│   ├── main.js
│   └── preload.mjs
├── electron/                   # Electron source files
│   ├── electron-env.d.ts
│   ├── main.ts               # Electron main process
│   └── preload.ts            # Preload script
├── public/                    # Static assets
│   └── assets/
│       ├── css/              # Stylesheets
│       ├── images/           # Images & logos
│       ├── js/               # JavaScript libraries
│       └── vendors/          # Third-party libraries
│           ├── apexcharts/   # ApexCharts library
│           ├── bootstrap/    # Bootstrap
│           └── ...
├── src/                       # Source code
│   ├── components/           # React components
│   │   ├── ApexChartComponent.tsx
│   │   ├── ChartComponent.tsx
│   │   ├── ExportPDFButton.tsx
│   │   ├── ProductList.tsx
│   │   └── StrukThermal.tsx
│   ├── config/               # Configuration
│   │   └── axios.ts          # Axios configuration
│   ├── context/              # React Context
│   │   ├── AuthContext.tsx
│   │   └── AuthContextDef.ts
│   ├── hooks/                # Custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── useDashboard.ts
│   │   └── useExportPDF.ts
│   ├── layout/               # Layout components
│   │   ├── Auth.tsx
│   │   ├── DashboardAdmin.tsx
│   │   └── DashboardKasir.tsx
│   ├── pages/                # Page components
│   │   ├── Home.tsx          # Dashboard page
│   │   ├── Kasir/
│   │   ├── KategoriProduk/
│   │   ├── Laporan/
│   │   ├── Produk/
│   │   ├── Satuan/
│   │   ├── Transaksi/
│   │   └── User/
│   ├── services/             # API Services
│   │   ├── authService.ts
│   │   ├── dashboardService.ts
│   │   ├── kategoriProdukService.ts
│   │   ├── laporanService.ts
│   │   ├── produkService.ts
│   │   ├── satuanService.ts
│   │   ├── transaksiService.ts
│   │   └── userService.ts
│   ├── utils/                # Utility functions
│   │   └── strukPrinter.ts
│   ├── App.tsx               # Main App component
│   ├── App.css
│   ├── main.tsx              # Entry point
│   └── index.css
├── .gitignore
├── electron-builder.json5     # Electron Builder config
├── index.html
├── package.json
├── tsconfig.json              # TypeScript config
├── tsconfig.node.json
├── vite.config.ts             # Vite config
└── README.md                  # This file

Dokumentasi:
├── CARA_PENGGUNAAN_AXIOS.md
├── CRUD_PRODUK_IMPLEMENTATION.md
├── CRUD_SATUAN_IMPLEMENTATION.md
├── IMPLEMENTASI_DASHBOARD_STATISTIK.md
├── IMPLEMENTASI_EXPORT_PDF.md
├── IMPLEMENTASI_LOGIN.md
├── QUICK_REFERENCE_DASHBOARD.md
├── QUICK_REFERENCE_EXPORT_PDF.md
├── SUMMARY_DASHBOARD.md
├── TESTING_GUIDE_DASHBOARD.md
├── UPDATE_HOME_PAGE.md
└── doc-api.json               # API Documentation
```

## 📚 Dokumentasi

Dokumentasi lengkap tersedia di folder docs:

| File                                  | Deskripsi                                          |
| ------------------------------------- | -------------------------------------------------- |
| `IMPLEMENTASI_LOGIN.md`               | Panduan implementasi sistem login & authentication |
| `CARA_PENGGUNAAN_AXIOS.md`            | Cara menggunakan Axios untuk API calls             |
| `CRUD_PRODUK_IMPLEMENTATION.md`       | Implementasi CRUD produk                           |
| `CRUD_SATUAN_IMPLEMENTATION.md`       | Implementasi CRUD satuan                           |
| `IMPLEMENTASI_DASHBOARD_STATISTIK.md` | Implementasi dashboard dengan statistik & charts   |
| `IMPLEMENTASI_EXPORT_PDF.md`          | Implementasi export laporan ke PDF                 |
| `QUICK_REFERENCE_DASHBOARD.md`        | Quick reference untuk dashboard                    |
| `QUICK_REFERENCE_EXPORT_PDF.md`       | Quick reference untuk export PDF                   |
| `SUMMARY_DASHBOARD.md`                | Summary fitur dashboard                            |
| `TESTING_GUIDE_DASHBOARD.md`          | Panduan testing dashboard                          |
| `UPDATE_HOME_PAGE.md`                 | Update log home page                               |
| `doc-api.json`                        | Dokumentasi API lengkap (OpenAPI 3.1.0)            |

## 🔧 Troubleshooting

### Aplikasi tidak bisa start

**Problem**: Error saat `npm run dev`

**Solution**:

```bash
# Hapus node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Chart tidak muncul

**Problem**: Chart tidak render di dashboard

**Solution**:

1. Buka Developer Tools (Ctrl+Shift+I atau F12)
2. Cek Console untuk error
3. Pastikan file ApexCharts ada di `public/assets/vendors/apexcharts/`
4. Refresh halaman (Ctrl+R)

### API Error / CORS Issue

**Problem**: Error saat fetch data dari API

**Solution**:

1. Pastikan backend API berjalan
2. Cek CORS settings di backend
3. Verifikasi URL di `src/config/axios.ts`
4. Cek token authentication di localStorage

### Build Error

**Problem**: Error saat `npm run build`

**Solution**:

```bash
# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### Electron Window Blank

**Problem**: Aplikasi terbuka tapi layar kosong

**Solution**:

1. Buka Developer Tools di Electron (Ctrl+Shift+I)
2. Cek Console errors
3. Pastikan `index.html` ada di root
4. Restart aplikasi

### TypeScript Errors

**Problem**: TS compilation errors

**Solution**:

```bash
# Check TypeScript config
npx tsc --noEmit

# If errors persist, check tsconfig.json
```

### Port Already in Use

**Problem**: Port 5173 sudah digunakan

**Solution**:

```bash
# Kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

## 👥 Tim Pengembang

- **Developer**: [Your Name]
- **Backend Team**: [Backend Team Names]
- **UI/UX**: [Designer Names]

---

**Dibuat dengan ❤️ untuk Toko Sehat Kabanjahe**

**Version**: 1.0.0  
**Last Update**: October 29, 2025  
**Status**: ✅ Production Ready
