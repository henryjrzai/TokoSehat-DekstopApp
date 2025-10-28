import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Auth from "./layout/Auth";
import DashboardAdmin from "./layout/DashboardAdmin";
import Home from "./pages/Home";
import ProdukList from "./pages/Produk/ProdukList";
import ProdukForm from "./pages/Produk/ProdukForm";

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

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

  return (
    <BrowserRouter>
      <DashboardAdmin>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produk" element={<ProdukList />} />
          <Route path="/produk/tambah" element={<ProdukForm />} />
          <Route path="/produk/edit/:id" element={<ProdukForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardAdmin>
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
