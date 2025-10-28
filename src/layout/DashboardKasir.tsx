import { useAuth } from "../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";

export default function DashboardKasir({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, user } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      logout();
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div>
      <div id="app">
        {/* Simple header with navigation tabs */}
        <header className="mb-1">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center py-3">
              <div>
                <h3 className="mb-0">Toko Sehat Kabanjahe</h3>
                <small className="text-muted">
                  Kasir: <strong>{user?.nama}</strong>
                </small>
              </div>
              <div className="d-flex gap-3 align-items-center">
                <Link
                  to="/"
                  className={`btn ${
                    isActive("/") ? "btn-primary" : "btn-outline-primary"
                  }`}
                >
                  <i className="bi bi-house-fill me-2"></i>
                  Kasir
                </Link>
                <Link
                  to="/produk"
                  className={`btn ${
                    isActive("/produk") ? "btn-primary" : "btn-outline-primary"
                  }`}
                >
                  <i className="bi bi-stack me-2"></i>
                  Produk
                </Link>
                <Link
                  to="/transaksi"
                  className={`btn ${
                    isActive("/transaksi")
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                >
                  <i className="bi bi-cart-fill me-2"></i>
                  Transaksi
                </Link>
                <button className="btn btn-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <div style={{ padding: "20px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
