# Cara Menggunakan Axios dengan Bearer Token

## Quick Start

Setelah implementasi login selesai, untuk menggunakan axios di service/component lain sangat mudah:

```typescript
import axiosInstance from "../config/axios";

// GET Request
const fetchData = async () => {
  const response = await axiosInstance.get("/endpoint");
  return response.data;
};

// POST Request
const createData = async (data) => {
  const response = await axiosInstance.post("/endpoint", data);
  return response.data;
};

// PUT Request
const updateData = async (id, data) => {
  const response = await axiosInstance.put(`/endpoint/${id}`, data);
  return response.data;
};

// DELETE Request
const deleteData = async (id) => {
  await axiosInstance.delete(`/endpoint/${id}`);
};
```

**Bearer token akan otomatis ditambahkan ke setiap request!**

## Struktur Service Pattern

Lihat contoh lengkap di:

- `src/services/productService.ts` - Template service dengan CRUD lengkap
- `src/components/ProductList.tsx` - Contoh penggunaan di component

## Testing Login

1. Jalankan aplikasi: `npm run dev`
2. Aplikasi akan membuka halaman login
3. Masukkan credentials:
   - Username: `admin`
   - Password: `admin123`
4. Setelah login berhasil, token disimpan otomatis
5. Semua request selanjutnya akan include bearer token

## File-file Penting

### Core Files

- `src/config/axios.ts` - Axios instance dengan interceptor
- `src/services/authService.ts` - Login/logout functions
- `src/context/AuthContext.tsx` - Auth state management
- `src/hooks/useAuth.ts` - Hook untuk akses auth state

### Component Examples

- `src/layout/Auth.tsx` - Login form
- `src/layout/DashboardAdmin.tsx` - Dashboard dengan logout
- `src/components/ProductList.tsx` - Contoh fetch data dengan axios

### Service Examples

- `src/services/productService.ts` - Template CRUD service

## Flow Diagram

```
Login Flow:
User Input → Auth.tsx → authService.login() → API
                                ↓
                        Save token to localStorage
                                ↓
                        AuthContext updates state
                                ↓
                        App.tsx redirects to Dashboard

API Call Flow:
Component → Service → axiosInstance.get/post/put/delete
                            ↓
                    Interceptor adds Bearer Token
                            ↓
                        API Request
                            ↓
                    Response/Error handled
```

## Auto Logout

Aplikasi otomatis logout jika:

- Response 401 (Unauthorized) dari API
- Token tidak valid
- User klik tombol logout

## Environment Variables (Optional)

Untuk production, tambahkan `.env`:

```env
VITE_API_URL=http://kasir-toko-sehat-ws.test/api
```

Lalu update `src/config/axios.ts`:

```typescript
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://kasir-toko-sehat-ws.test/api";
```

## Tips Development

1. **Buat service per modul**: Pisahkan logic API ke file service
2. **Type safety**: Gunakan TypeScript interface untuk request/response
3. **Error handling**: Catch error di component level untuk UX yang baik
4. **Loading state**: Tampilkan loading indicator saat fetch data
5. **Token refresh**: Implementasikan jika API support refresh token

## Troubleshooting

### CORS Error

Pastikan backend mengizinkan origin dari Electron app

### 401 Unauthorized

- Cek token di localStorage (F12 → Application → Local Storage)
- Cek format Authorization header di Network tab
- Pastikan token belum expired

### Network Error

- Cek backend sedang running
- Cek URL API sudah benar
- Cek firewall/antivirus tidak block

## Next Steps

1. Implementasikan routing (React Router)
2. Tambahkan service untuk modul lain (transaksi, barang, laporan)
3. Implementasikan token refresh jika diperlukan
4. Tambahkan global loading indicator
5. Implementasikan error boundary

## Support

Dokumentasi lengkap ada di: `IMPLEMENTASI_LOGIN.md`
