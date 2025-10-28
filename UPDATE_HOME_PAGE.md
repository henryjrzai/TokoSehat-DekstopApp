# Update: Response API & Halaman Home

## Perubahan yang Dilakukan

### 1. Update Interface untuk Response API

Response dari API telah disesuaikan dengan format yang sebenarnya:

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "id": 1,
    "nama": "admin",
    "username": "admin",
    "hak_akses": "admin",
    "created_at": "2025-09-14T03:26:08.000000Z",
    "updated_at": "2025-09-16T14:08:22.000000Z"
  },
  "token": "6|snRjGm6rR3TcvocEfnaaDfJIonlOV1YD7tgbTTGV6aefd9a9"
}
```

### 2. File yang Diupdate

**`src/services/authService.ts`**

- Interface `User` disesuaikan dengan response API
- Interface `LoginResponse` disesuaikan dengan struktur response
- Menyimpan `response.data.data` sebagai user data

**`src/context/AuthContext.tsx`**

- Menggunakan `UserData` dari authService
- Update logic untuk mengambil `response.data`

**`src/context/AuthContextDef.ts`**

- Update interface untuk menggunakan `UserData`

**`src/pages/Home.tsx`**

- Menampilkan sapaan berdasarkan waktu (Pagi/Siang/Sore/Malam)
- Menampilkan nama user yang login
- Menampilkan informasi lengkap user

### 3. Fitur di Halaman Home

✅ **Sapaan Dinamis**

- Selamat Pagi (00:00 - 10:59)
- Selamat Siang (11:00 - 14:59)
- Selamat Sore (15:00 - 17:59)
- Selamat Malam (18:00 - 23:59)

✅ **Informasi User**

- Avatar dengan icon
- Nama lengkap dari field `nama`
- Username dan hak akses
- Detail informasi dalam tabel

✅ **Data yang Ditampilkan**

- ID User
- Nama
- Username
- Hak Akses (dengan badge)
- Tanggal dibuat (format Indonesia)
- Tanggal terakhir update (format Indonesia)

## Testing

1. Jalankan aplikasi: `npm run dev`
2. Login dengan credentials:
   - Username: `admin`
   - Password: `admin123`
3. Setelah login, Anda akan melihat halaman Home dengan:
   - Sapaan sesuai waktu
   - Nama user yang login
   - Informasi lengkap user

## Screenshot Flow

```
Login Page
    ↓
  Input: admin / admin123
    ↓
  Click "Log in"
    ↓
  API Response dengan token & data user
    ↓
  Token disimpan di localStorage
    ↓
  Redirect ke Dashboard
    ↓
  Home menampilkan:
  "Selamat [Pagi/Siang/Sore/Malam], admin!"
  @admin · admin
  + Tabel informasi lengkap
```

## Struktur Data User

```typescript
interface UserData {
  id: number;
  nama: string; // Nama lengkap
  username: string; // Username untuk login
  hak_akses: string; // Role/Level akses
  created_at: string; // Timestamp dibuat
  updated_at: string; // Timestamp terakhir update
}
```

## Customization

Untuk mengubah format tampilan, edit file `src/pages/Home.tsx`:

### Ubah Format Tanggal

```typescript
new Date(user.created_at).toLocaleString("id-ID", {
  dateStyle: "long", // "full", "long", "medium", "short"
  timeStyle: "short", // "full", "long", "medium", "short"
});
```

### Ubah Waktu Sapaan

```typescript
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat Pagi";
  // dst...
};
```

## Next Steps

- Tambahkan statistik dashboard (total transaksi, barang, dll)
- Buat chart untuk visualisasi data
- Tambahkan quick action buttons
- Implementasi dark mode
