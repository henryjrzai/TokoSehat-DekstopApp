import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllUsers, deleteUser, type User } from "../../services/userService";

export default function UserList() {
  const location = useLocation();
  const [userList, setUserList] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadUsers();

    // Ambil success message dari navigation state
    if (location.state && (location.state as { success?: string }).success) {
      setSuccess((location.state as { success: string }).success);
      setTimeout(() => setSuccess(""), 3000);
      // Clear state agar tidak muncul lagi saat refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllUsers();
      setUserList(data);
      setFilteredUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredUsers(userList);
      return;
    }

    const filtered = userList.filter((user) => {
      const searchLower = value.toLowerCase();
      return (
        user.nama.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower) ||
        user.hak_akses.toLowerCase().includes(searchLower)
      );
    });

    setFilteredUsers(filtered);
  };

  const handleDelete = async (id: number, nama: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus user "${nama}"?`)) {
      return;
    }

    try {
      await deleteUser(id);
      setSuccess(`User "${nama}" berhasil dihapus`);
      setTimeout(() => setSuccess(""), 3000);
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus user");
      setTimeout(() => setError(""), 5000);
    }
  };

  const getBadgeClass = (hakAkses: string) => {
    switch (hakAkses) {
      case "admin":
        return "bg-danger";
      case "kasir":
        return "bg-primary";
      case "pemilik":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Data User</h3>
            <p className="text-subtitle text-muted">
              Kelola data pengguna sistem
            </p>
          </div>
          <div className="col-12 col-md-6 order-md-2 order-first">
            <nav
              aria-label="breadcrumb"
              className="breadcrumb-header float-start float-lg-end"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  User
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="card">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Daftar User</h5>
              <Link to="/user/tambah" className="btn btn-primary">
                <i className="bi bi-plus-circle"></i> Tambah User
              </Link>
            </div>
          </div>
          <div className="card-body">
            {/* Search Box */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cari berdasarkan nama, username, atau hak akses..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleSearch("")}
                      title="Clear search"
                    >
                      <i className="bi bi-x-circle"></i>
                    </button>
                  )}
                </div>
                {searchTerm && (
                  <small className="text-muted">
                    Ditemukan {filteredUsers.length} dari {userList.length} user
                  </small>
                )}
              </div>
            </div>

            {/* Alert Messages */}
            {error && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                <i className="bi bi-exclamation-triangle"></i> {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError("")}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {success && (
              <div
                className="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                <i className="bi bi-check-circle"></i> {success}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSuccess("")}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span className="ms-3">Memuat data...</span>
              </div>
            ) : (
              /* Table */
              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead>
                    <tr>
                      <th style={{ width: "5%" }}>No</th>
                      <th style={{ width: "25%" }}>Nama</th>
                      <th style={{ width: "20%" }}>Username</th>
                      <th style={{ width: "15%" }}>Hak Akses</th>
                      <th style={{ width: "20%" }}>Dibuat</th>
                      <th style={{ width: "15%" }} className="text-center">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                          <p className="text-muted">
                            {searchTerm
                              ? "User tidak ditemukan"
                              : "Belum ada data user"}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <tr key={user.id}>
                          <td>{index + 1}</td>
                          <td>
                            <strong>{user.nama}</strong>
                          </td>
                          <td>
                            <code>{user.username}</code>
                          </td>
                          <td>
                            <span
                              className={`badge ${getBadgeClass(
                                user.hak_akses
                              )}`}
                            >
                              {user.hak_akses.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {user.created_at
                                ? new Date(user.created_at).toLocaleDateString(
                                    "id-ID"
                                  )
                                : "-"}
                            </small>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Link
                                to={`/user/change-password/${user.id}`}
                                className="btn btn-sm btn-info"
                                title="Ubah Password"
                              >
                                <i className="bi bi-key"></i>
                              </Link>
                              <Link
                                to={`/user/edit/${user.id}`}
                                className="btn btn-sm btn-warning"
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                className="btn btn-sm btn-danger"
                                title="Hapus"
                                onClick={() => handleDelete(user.id, user.nama)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer Info */}
            {!loading && userList.length > 0 && (
              <div className="mt-3">
                <small className="text-muted">
                  Menampilkan {filteredUsers.length} dari {userList.length} user
                </small>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
