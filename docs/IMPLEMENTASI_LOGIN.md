# Implementasi Login dan Manajemen Sesi

## Struktur File yang Dibuat

```
src/
├── config/
│   └── axios.ts                 # Konfigurasi axios dengan interceptor
├── services/
│   ├── authService.ts          # Service untuk autentikasi (login, logout)
│   └── productService.ts       # Contoh service untuk API lainnya
└── context/
    └── AuthContext.tsx         # Context untuk state management autentikasi
```

## Fitur yang Diimplementasikan

### 1. **Konfigurasi Axios** (`src/config/axios.ts`)

- Base URL: `http://kasir-toko-sehat-ws.test/api`
- **Request Interceptor**: Otomatis menambahkan Bearer Token ke setiap request
- **Response Interceptor**: Handle error 401 (Unauthorized) dan auto-logout
- Token disimpan di `localStorage` dengan key `bearer_token`

### 2. **Auth Service** (`src/services/authService.ts`)

Menyediakan fungsi-fungsi:

- `login(credentials)`: Login dan simpan token
- `logout()`: Hapus token dan data user
- `isAuthenticated()`: Cek status login
- `getToken()`: Ambil bearer token
- `getUserData()`: Ambil data user yang login

### 3. **Auth Context** (`src/context/AuthContext.tsx`)

- Global state management untuk autentikasi
- Auto-check authentication saat aplikasi load
- Menyediakan `useAuth()` hook untuk akses state dan function

### 4. **Komponen Login** (`src/layout/Auth.tsx`)

- Form login dengan validasi
- Loading state
- Error handling dan alert
- Integrasi dengan AuthContext

### 5. **Protected Routes** (`src/App.tsx`)

- Conditional rendering berdasarkan status login
- Loading screen saat check authentication
- Wrapped dengan AuthProvider

### 6. **Logout Feature** (`src/layout/DashboardAdmin.tsx`)

- Button logout dengan konfirmasi
- Auto-redirect ke login setelah logout

## Cara Penggunaan

### Login

```typescript
import { useAuth } from "../context/AuthContext";

function LoginComponent() {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        username: "admin",
        password: "admin123",
      });
      // Otomatis redirect ke dashboard
    } catch (error) {
      console.error(error);
    }
  };
}
```

### Logout

```typescript
import { useAuth } from "../context/AuthContext";

function Component() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Otomatis redirect ke login
  };
}
```

### Menggunakan Axios untuk API Lainnya

```typescript
import axiosInstance from "../config/axios";

// GET request
const getData = async () => {
  const response = await axiosInstance.get("/endpoint");
  return response.data;
};

// POST request
const createData = async (data) => {
  const response = await axiosInstance.post("/endpoint", data);
  return response.data;
};

// PUT request
const updateData = async (id, data) => {
  const response = await axiosInstance.put(`/endpoint/${id}`, data);
  return response.data;
};

// DELETE request
const deleteData = async (id) => {
  await axiosInstance.delete(`/endpoint/${id}`);
};
```

### Contoh Service Pattern

Lihat `src/services/productService.ts` untuk contoh lengkap implementasi CRUD dengan axios yang sudah include bearer token otomatis.

## Format Response API yang Diharapkan

### Login Endpoint

```
POST http://kasir-toko-sehat-ws.test/api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response Success:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Administrator",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Response Error:**

```json
{
  "message": "Invalid credentials"
}
```

## Storage

Bearer token dan data user disimpan di `localStorage`:

- `bearer_token`: Bearer token dari API
- `user_data`: JSON string data user

## Auto-Logout

Aplikasi akan otomatis logout jika:

1. Mendapat response 401 dari API
2. User klik tombol logout
3. Token dihapus dari localStorage

## Tips Pengembangan

1. **Ubah Base URL** di `src/config/axios.ts` sesuai environment:

   ```typescript
   const BASE_URL =
     process.env.VITE_API_URL || "http://kasir-toko-sehat-ws.test/api";
   ```

2. **Tambahkan interceptor lain** jika diperlukan (misal: loading indicator global)

3. **Buat service file terpisah** untuk setiap modul (product, transaction, user, dll)

4. **Gunakan TypeScript interface** untuk type safety

5. **Error handling** bisa diperbaiki sesuai format response API Anda

## Security Notes

- Token disimpan di localStorage (untuk Electron app ini aman)
- Untuk production, pertimbangkan encryption token
- Selalu gunakan HTTPS di production
- Implementasikan token refresh jika diperlukan
