# CRUD Satuan Implementation

## 📋 Overview

Implementasi lengkap CRUD (Create, Read, Update, Delete) untuk manajemen data **Satuan** produk pada aplikasi Toko Sehat Kabanjahe.

## 🗂️ File Structure

```
src/
├── services/
│   └── satuanService.ts          # ✅ Service Satuan (sudah ada)
├── pages/
│   └── Satuan/
│       ├── SatuanList.tsx        # ✅ Halaman daftar satuan
│       └── SatuanForm.tsx        # ✅ Form tambah/edit satuan
├── App.tsx                       # ✅ Updated dengan routes satuan
└── layout/
    └── DashboardAdmin.tsx        # ✅ Updated dengan menu satuan
```

## 🔌 API Endpoints

### Base URL

```
http://kasir-toko-sehat-ws.test/api
```

### Endpoints Satuan

- `GET /satuan` - Get all satuan
- `GET /satuan/{id}` - Get satuan by ID
- `POST /satuan` - Create satuan
- `PUT /satuan/{id}` - Update satuan
- `DELETE /satuan/{id}` - Delete satuan

## 📊 Data Structure

### Satuan Interface

```typescript
interface Satuan {
  id: number;
  kode_satuan: string;
  nama_satuan: string;
  deskripsi?: string;
  created_at?: string;
  updated_at?: string;
}
```

### SatuanRequest Interface

```typescript
interface SatuanRequest {
  kode_satuan: string;
  nama_satuan: string;
  deskripsi?: string;
}
```

## 🎨 Features

### 1. List Satuan (`/satuan`)

**File:** `src/pages/Satuan/SatuanList.tsx`

**Fitur:**

- ✅ Tampilan tabel dengan kolom: No, Kode, Nama Satuan, Deskripsi, Aksi
- ✅ Loading state dengan spinner
- ✅ Empty state ketika belum ada data
- ✅ Alert success/error dengan auto-dismiss
- ✅ Button tambah satuan
- ✅ Action buttons: Edit & Delete
- ✅ Konfirmasi sebelum delete
- ✅ Breadcrumb navigation
- ✅ Counter total satuan

**Komponen UI:**

- Bootstrap table (hover & striped)
- Bootstrap Icons
- Alert dismissible
- Loading spinner

### 2. Form Tambah Satuan (`/satuan/tambah`)

**File:** `src/pages/Satuan/SatuanForm.tsx`

**Fields:**

- ✅ Kode Satuan\* (required, max 10 karakter)
- ✅ Nama Satuan\* (required, max 50 karakter)
- ✅ Deskripsi (optional, max 255 karakter)

**Validasi:**

- Kode satuan harus diisi
- Nama satuan harus diisi
- Placeholder & helper text untuk setiap field
- Client-side validation

**Fitur:**

- Loading state saat submit
- Error handling dengan alert
- Button kembali ke list
- Button simpan dengan loading indicator
- Redirect ke list setelah sukses dengan success message

### 3. Form Edit Satuan (`/satuan/edit/:id`)

**File:** `src/pages/Satuan/SatuanForm.tsx` (unified form)

**Fitur:**

- ✅ Pre-fill form dengan data existing
- ✅ Loading state saat fetch data
- ✅ Update data via PUT request
- ✅ Validasi sama dengan form tambah
- ✅ Redirect ke list setelah sukses

**Mode Detection:**

- Detect edit mode dari URL parameter `id`
- Dynamic title & breadcrumb
- Dynamic button text (Simpan/Update)

## 🛣️ Routes

```typescript
<Route path="/satuan" element={<SatuanList />} />
<Route path="/satuan/tambah" element={<SatuanForm />} />
<Route path="/satuan/edit/:id" element={<SatuanForm />} />
```

## 🎯 Navigation

### Sidebar Menu

```tsx
<li className="sidebar-item">
  <Link to="/satuan" className="sidebar-link">
    <i className="bi bi-rulers"></i>
    <span>Satuan</span>
  </Link>
</li>
```

### Active State Detection

- Menggunakan `useLocation()` hook
- Highlight menu aktif dengan class `active`

## 🔄 State Management

### SatuanList States

```typescript
const [satuanList, setSatuanList] = useState<Satuan[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
```

### SatuanForm States

```typescript
const [formData, setFormData] = useState<SatuanRequest>({
  kode_satuan: "",
  nama_satuan: "",
  deskripsi: "",
});
const [loading, setLoading] = useState(false);
const [loadingData, setLoadingData] = useState(false);
const [error, setError] = useState("");
```

## 📝 Form Handling

### onChange Handler

```typescript
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};
```

### Submit Handler

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Validasi
  // Submit ke API
  // Redirect dengan success message
};
```

## ✅ Success Message Flow

1. Submit form → Success
2. Navigate dengan state:
   ```typescript
   navigate("/satuan", {
     state: { success: "Satuan berhasil ditambahkan" },
   });
   ```
3. SatuanList detect state:
   ```typescript
   useEffect(() => {
     if (location.state?.success) {
       setSuccess(location.state.success);
       // Clear state
       window.history.replaceState({}, document.title);
     }
   }, [location]);
   ```

## ⚠️ Error Handling

### Service Layer

```typescript
try {
  const response = await axiosInstance.get("/satuan");
  return response.data.data;
} catch (error) {
  throw new Error("Gagal mengambil data satuan");
}
```

### Component Layer

```typescript
try {
  await deleteSatuan(id);
  setSuccess("Satuan berhasil dihapus");
} catch (err) {
  setError(err.message);
}
```

## 🎨 UI Components

### Alert Success

```tsx
<div className="alert alert-success alert-dismissible fade show">
  <i className="bi bi-check-circle"></i> {success}
  <button className="btn-close" onClick={() => setSuccess("")}></button>
</div>
```

### Alert Error

```tsx
<div className="alert alert-danger alert-dismissible fade show">
  <i className="bi bi-exclamation-triangle"></i> {error}
  <button className="btn-close" onClick={() => setError("")}></button>
</div>
```

### Loading State

```tsx
<div className="d-flex justify-content-center py-5">
  <div className="spinner-border text-primary">
    <span className="visually-hidden">Loading...</span>
  </div>
  <span className="ms-3">Memuat data...</span>
</div>
```

### Empty State

```tsx
<tr>
  <td colSpan={5} className="text-center py-4">
    <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
    <p className="text-muted">Belum ada data satuan</p>
  </td>
</tr>
```

## 🧪 Testing Checklist

### List Page

- [ ] Load data satuan dari API
- [ ] Tampilkan loading state
- [ ] Tampilkan empty state jika kosong
- [ ] Click button tambah → redirect ke form
- [ ] Click button edit → redirect ke form dengan data
- [ ] Click button delete → konfirmasi → delete → refresh list
- [ ] Success message muncul setelah add/edit

### Form Page

- [ ] Form kosong untuk mode tambah
- [ ] Form pre-filled untuk mode edit
- [ ] Validasi field required
- [ ] Submit form → success → redirect ke list
- [ ] Error handling → tampilkan alert
- [ ] Loading state saat submit
- [ ] Button kembali → redirect ke list

## 🚀 Usage

### Tambah Satuan Baru

1. Klik menu **Satuan** di sidebar
2. Klik button **Tambah Satuan**
3. Isi form:
   - Kode Satuan: PCS, KG, LITER, dll
   - Nama Satuan: Pieces, Kilogram, Liter, dll
   - Deskripsi: (optional)
4. Klik **Simpan**
5. Redirect ke list dengan success message

### Edit Satuan

1. Di halaman list, klik button **Edit** (icon pensil)
2. Form terbuka dengan data existing
3. Ubah data yang diperlukan
4. Klik **Update**
5. Redirect ke list dengan success message

### Hapus Satuan

1. Di halaman list, klik button **Hapus** (icon trash)
2. Konfirmasi dialog muncul
3. Klik **OK** untuk konfirmasi
4. Satuan dihapus, list di-refresh
5. Success message muncul

## 📌 Notes

### Relasi dengan Produk

- Satuan digunakan pada produk untuk menentukan unit produk
- Satuan yang sudah digunakan tidak dapat dihapus (constraint database)
- Pesan error akan muncul jika mencoba menghapus satuan yang digunakan

### Best Practices

- ✅ Unified form untuk tambah & edit
- ✅ Loading state untuk UX yang baik
- ✅ Error handling yang comprehensive
- ✅ Success message dengan auto-dismiss
- ✅ Konfirmasi sebelum delete
- ✅ Client-side validation
- ✅ Responsive layout dengan Bootstrap

## 🔐 Authentication

- Semua endpoint menggunakan Bearer token
- Token otomatis di-attach oleh axios interceptor
- Auto logout jika 401 Unauthorized

## 🎯 Next Steps

- [ ] Implementasi CRUD Kategori Produk
- [ ] Implementasi CRUD Supplier
- [ ] Implementasi CRUD Pelanggan
- [ ] Implementasi pagination untuk data yang banyak
- [ ] Implementasi search/filter satuan
- [ ] Export data satuan ke Excel/PDF

---

**Status:** ✅ Completed  
**Last Updated:** 28 Oktober 2025  
**Developer:** GitHub Copilot
