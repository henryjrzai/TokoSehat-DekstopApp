import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Auth from "./layout/Auth";
import DashboardAdmin from "./layout/DashboardAdmin";
import DashboardKasir from "./layout/DashboardKasir";
import Home from "./pages/Home";
import KasirPage from "./pages/Kasir/KasirPage";
import ProdukList from "./pages/Produk/ProdukList";
import ProdukForm from "./pages/Produk/ProdukForm";
import SatuanList from "./pages/Satuan/SatuanList";
import SatuanForm from "./pages/Satuan/SatuanForm";
import UserList from "./pages/User/UserList";
import UserForm from "./pages/User/UserForm";
import ChangePassword from "./pages/User/ChangePassword";
import KategoriProdukList from "./pages/KategoriProduk/KategoriProdukList";
import KategoriProdukForm from "./pages/KategoriProduk/KategoriProdukForm";
import TransaksiList from "./pages/Transaksi/TransaksiList";
import TransaksiDetail from "./pages/Transaksi/TransaksiDetail";
import LaporanPage from "./pages/Laporan/LaporanPage";

function AppContent() {
  const { isAuthenticated, loading, user } = useAuth();

  // Tampilkan loading saat mengecek authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  // Determine which layout to use based on user role
  const isKasir = user?.hak_akses === "kasir";
  const Layout = isKasir ? DashboardKasir : DashboardAdmin;

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Routes for Kasir */}
          {isKasir ? (
            <>
              <Route path="/" element={<KasirPage />} />
              <Route path="/produk" element={<ProdukList />} />
              <Route path="/transaksi" element={<TransaksiList />} />
              <Route
                path="/transaksi/detail/:id"
                element={<TransaksiDetail />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            /* Routes for Admin and Pemilik */
            <>
              <Route path="/" element={<Home />} />
              <Route path="/produk" element={<ProdukList />} />
              <Route path="/produk/tambah" element={<ProdukForm />} />
              <Route path="/produk/edit/:id" element={<ProdukForm />} />
              <Route path="/satuan" element={<SatuanList />} />
              <Route path="/satuan/tambah" element={<SatuanForm />} />
              <Route path="/satuan/edit/:id" element={<SatuanForm />} />
              <Route path="/kategori-produk" element={<KategoriProdukList />} />
              <Route
                path="/kategori-produk/tambah"
                element={<KategoriProdukForm />}
              />
              <Route
                path="/kategori-produk/edit/:id"
                element={<KategoriProdukForm />}
              />
              <Route path="/user" element={<UserList />} />
              <Route path="/user/tambah" element={<UserForm />} />
              <Route path="/user/edit/:id" element={<UserForm />} />
              <Route
                path="/user/change-password/:id"
                element={<ChangePassword />}
              />
              <Route path="/transaksi" element={<TransaksiList />} />
              <Route
                path="/transaksi/detail/:id"
                element={<TransaksiDetail />}
              />
              <Route path="/laporan" element={<LaporanPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
