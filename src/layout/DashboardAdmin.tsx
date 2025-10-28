import { useAuth } from "../hooks/useAuth";

export default function DashboardAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      logout();
    }
  };

  return (
    <div>
      <div id="app">
        <div id="sidebar" className="active">
          <div className="sidebar-wrapper active">
            <div className="sidebar-header">
              <div className="d-flex justify-content-between">
                <div className="logo">
                  <a href="index.html">Dashboard</a>
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

                <li className="sidebar-item active ">
                  <a href="index.html" className="sidebar-link">
                    <i className="bi bi-grid-fill"></i>
                    <span>Dashboard</span>
                  </a>
                </li>
                <li className="sidebar-item">
                  <a href="index.html" className="sidebar-link">
                    <i className="bi bi-cart-fill"></i>
                    <span>Transaksi</span>
                  </a>
                </li>
                <li className="sidebar-item">
                  <a href="index.html" className="sidebar-link">
                    <i className="bi bi-stack"></i>
                    <span>Barang</span>
                  </a>
                </li>
                <li className="sidebar-item">
                  <a href="index.html" className="sidebar-link">
                    <i className="bi bi-file-earmark-bar-graph-fill"></i>
                    <span>Laporan</span>
                  </a>
                </li>
                <li className="sidebar-item">
                  <a href="index.html" className="sidebar-link">
                    <i className="bi bi-people-fill"></i>
                    <span>Pengguna</span>
                  </a>
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
