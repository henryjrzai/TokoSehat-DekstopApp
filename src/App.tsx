import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Auth from "./layout/Auth";
import DashboardAdmin from "./layout/DashboardAdmin";
import Home from "./pages/Home";

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

  return (
    <div>
      {isAuthenticated ? (
        <DashboardAdmin>
          <Home />
        </DashboardAdmin>
      ) : (
        <Auth />
      )}
    </div>
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
