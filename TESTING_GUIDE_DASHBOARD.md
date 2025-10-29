# Testing Guide - Dashboard Statistik

## Pre-requisites

✅ Backend API berjalan di `http://kasir-toko-sehat-ws.test`  
✅ User sudah login dengan kredensial yang valid  
✅ Database memiliki data transaksi untuk testing

## Test Checklist

### 1. ✅ Visual Loading

- [ ] Saat buka dashboard, muncul spinner loading
- [ ] Setelah loading selesai, spinner hilang
- [ ] Semua cards muncul dengan data yang benar

### 2. ✅ Statistics Cards

**Hari Ini:**

- [ ] Menampilkan total transaksi hari ini
- [ ] Menampilkan total pendapatan dalam format Rupiah
- [ ] Icon berwarna purple
- [ ] Responsive di mobile

**Minggu Ini:**

- [ ] Menampilkan total transaksi minggu ini
- [ ] Menampilkan total pendapatan dalam format Rupiah
- [ ] Icon berwarna blue
- [ ] Data lebih besar atau sama dengan "Hari Ini"

**Bulan Ini:**

- [ ] Menampilkan total transaksi bulan ini
- [ ] Menampilkan total pendapatan dalam format Rupiah
- [ ] Icon berwarna green
- [ ] Data lebih besar atau sama dengan "Minggu Ini"

**Tahun Ini:**

- [ ] Menampilkan total transaksi tahun ini
- [ ] Menampilkan total pendapatan dalam format Rupiah
- [ ] Icon berwarna red
- [ ] Data lebih besar atau sama dengan "Bulan Ini"

### 3. ✅ Inventory Statistics

- [ ] Total Produk ditampilkan dengan benar
- [ ] Total Kategori ditampilkan dengan benar
- [ ] Produk Stok Menipis ditampilkan (jika ada)
- [ ] Icons sesuai (box, grid, exclamation)

### 4. ✅ Comparison Chart (Bar Chart)

- [ ] Chart muncul dengan benar
- [ ] Menampilkan 4 bars (Hari Ini, Minggu, Bulan, Tahun)
- [ ] Ada 2 dataset (Transaksi dan Pendapatan)
- [ ] Legend tampil di atas
- [ ] Tooltip muncul saat hover
- [ ] Format Rupiah di tooltip dan axis
- [ ] Responsive saat resize window

### 5. ✅ Yearly Sales Chart (Line Chart)

- [ ] Chart muncul sebagai line chart
- [ ] Menampilkan data per bulan (max 12 bulan)
- [ ] Line smooth dengan animasi
- [ ] Dual Y-axis (kiri: transaksi, kanan: pendapatan)
- [ ] Tooltip dengan format yang benar
- [ ] Responsive

### 6. ✅ Monthly Sales Chart (Line Chart)

- [ ] Chart muncul sebagai line chart
- [ ] Menampilkan data per hari dalam bulan
- [ ] Line smooth dengan animasi
- [ ] Dual Y-axis
- [ ] Tooltip dengan format yang benar
- [ ] Responsive

### 7. ✅ Weekly Sales Chart (Bar Chart)

- [ ] Chart muncul sebagai bar chart
- [ ] Menampilkan data 7 hari terakhir
- [ ] Bars dengan warna yang berbeda
- [ ] Dual Y-axis
- [ ] Tooltip dengan format yang benar
- [ ] Responsive

### 8. ✅ Refresh Functionality

- [ ] Button "Refresh" ada di header
- [ ] Klik refresh, muncul loading state
- [ ] Data ter-update setelah refresh
- [ ] Tidak ada error saat refresh

### 9. ✅ Error Handling

**Test dengan backend mati:**

- [ ] Muncul alert error yang jelas
- [ ] Ada tombol untuk reload
- [ ] Tidak crash aplikasi

**Test dengan token expired:**

- [ ] Redirect ke halaman login
- [ ] Atau muncul pesan error yang sesuai

### 10. ✅ Responsive Design

**Desktop (>1200px):**

- [ ] Cards dalam 4 kolom
- [ ] Charts dalam 2 kolom untuk yearly & monthly
- [ ] Semua terlihat rapi

**Tablet (768px - 1200px):**

- [ ] Cards dalam 2 kolom
- [ ] Charts full width
- [ ] Text masih readable

**Mobile (<768px):**

- [ ] Cards dalam 1-2 kolom
- [ ] Charts full width
- [ ] Scroll horizontal jika perlu
- [ ] Text tidak terpotong

### 11. ✅ Performance

- [ ] Dashboard load dalam < 3 detik (dengan data)
- [ ] Chart render smooth tanpa lag
- [ ] Tidak ada memory leak
- [ ] CPU usage normal

### 12. ✅ User Experience

- [ ] Greeting sesuai waktu (pagi/siang/sore/malam)
- [ ] Nama user ditampilkan
- [ ] Role user ditampilkan
- [ ] Animasi smooth
- [ ] Hover states bekerja

## Test Scenarios

### Scenario 1: Fresh Load

```
1. Buka aplikasi
2. Login
3. Tunggu dashboard load
4. Verifikasi semua data muncul
```

### Scenario 2: Data Update

```
1. Buat transaksi baru di halaman Kasir
2. Kembali ke dashboard
3. Klik refresh
4. Verifikasi data berubah
```

### Scenario 3: No Data

```
1. Gunakan database kosong
2. Buka dashboard
3. Verifikasi tidak ada error
4. Chart kosong tapi tidak crash
```

### Scenario 4: Network Error

```
1. Matikan backend
2. Buka dashboard
3. Verifikasi error handling
4. Nyalakan backend
5. Klik refresh
6. Verifikasi data muncul
```

### Scenario 5: Different Time Periods

```
1. Cek data hari ini
2. Bandingkan dengan minggu ini
3. Bandingkan dengan bulan ini
4. Bandingkan dengan tahun ini
5. Verifikasi logika benar (tahun > bulan > minggu > hari)
```

## Browser Testing

- [ ] **Chrome** (latest)
- [ ] **Edge** (latest)
- [ ] **Firefox** (latest)
- [ ] **Electron** (app utama)

## Expected Results

### With Data

```
✅ All cards show numbers > 0
✅ All charts render correctly
✅ No console errors
✅ Loading time < 3 seconds
✅ Refresh works
```

### Without Data

```
✅ Cards show 0 or empty state
✅ Charts show empty state (no crash)
✅ No console errors
✅ Error message clear and helpful
```

## Console Checks

Buka Console (F12) dan periksa:

- [ ] Tidak ada error merah
- [ ] API calls sukses (200 status)
- [ ] Data response sesuai format
- [ ] ApexCharts script loaded

## Network Tab Checks

Periksa di Network tab:

```
✅ GET /api/statistik/dashboard - 200 OK
✅ GET /api/statistik/comparison - 200 OK
✅ GET /api/statistik/tahunan - 200 OK
✅ GET /api/statistik/bulanan - 200 OK
✅ GET /api/statistik/mingguan - 200 OK
✅ All requests < 1 second
```

## Quick Test Commands

### Test API Manually

```bash
# Test dashboard stats
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://kasir-toko-sehat-ws.test/api/statistik/dashboard

# Test comparison
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://kasir-toko-sehat-ws.test/api/statistik/comparison

# Test yearly
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://kasir-toko-sehat-ws.test/api/statistik/tahunan

# Test monthly
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://kasir-toko-sehat-ws.test/api/statistik/bulanan

# Test weekly
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://kasir-toko-sehat-ws.test/api/statistik/mingguan
```

## Known Issues & Solutions

### Issue: Chart tidak muncul

**Solution:**

1. Cek console untuk error
2. Pastikan ApexCharts script loaded
3. Refresh halaman

### Issue: Data tidak update

**Solution:**

1. Klik tombol refresh
2. Logout dan login kembali
3. Clear cache

### Issue: Loading lama

**Solution:**

1. Cek koneksi internet
2. Cek backend performance
3. Optimize database queries di backend

## Final Checklist

Sebelum deploy:

- [ ] Semua test scenarios passed
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Responsive di semua ukuran
- [ ] Error handling works
- [ ] Documentation complete
- [ ] Code review done

---

**Testing Status**: Ready for testing ✅

Silakan jalankan semua test di atas dan laporkan jika ada issue!
