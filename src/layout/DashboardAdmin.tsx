import { useAuth } from "../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";

export default function DashboardAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
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
        <div id="sidebar" className="active">
          <div className="sidebar-wrapper active">
            <div className="sidebar-header">
              <div className="d-flex justify-content-between">
                <div className="logo">
                  <Link to="/">Dashboard</Link>
                </div>
                <div className="toggler">
                  <a href="#" className="sidebar-hide d-xl-none d-block">
                    <i className="bi bi-x bi-middle"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="sidebar-menu">
              <ul className="menu">
                <li className="sidebar-title">Menu</li>

                <li className={`sidebar-item ${isActive("/")}`}>
                  <Link to="/" className="sidebar-link">
                    <i className="bi bi-grid-fill"></i>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <a href="#" className="sidebar-link">
                    <i className="bi bi-cart-fill"></i>
                    <span>Transaksi</span>
                  </a>
                </li>
                <li className={`sidebar-item ${isActive("/produk")}`}>
                  <Link to="/produk" className="sidebar-link">
                    <i className="bi bi-stack"></i>
                    <span>Produk</span>
                  </Link>
                </li>
                <li className={`sidebar-item ${isActive("/satuan")}`}>
                  <Link to="/satuan" className="sidebar-link">
                    <i className="bi bi-rulers"></i>
                    <span>Satuan</span>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <a href="#" className="sidebar-link">
                    <i className="bi bi-file-earmark-bar-graph-fill"></i>
                    <span>Laporan</span>
                  </a>
                </li>
                <li className={`sidebar-item ${isActive("/user")}`}>
                  <Link to="/user" className="sidebar-link">
                    <i className="bi bi-people-fill"></i>
                    <span>Pengguna</span>
                  </Link>
                </li>
                <li className="sidebar-item mt-5">
                  <button
                    className="btn btn-danger w-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
            <button className="sidebar-toggler btn x">
              <i data-feather="x"></i>
            </button>
          </div>
        </div>
        <div id="main">
          <header className="mb-3">
            <a href="#" className="burger-btn d-block d-xl-none">
              <i className="bi bi-justify fs-3"></i>
            </a>
          </header>

          {children}
        </div>
      </div>
    </div>
  );
}
