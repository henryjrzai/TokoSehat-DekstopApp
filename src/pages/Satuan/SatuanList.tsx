import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  getAllSatuan,
  deleteSatuan,
  Satuan,
} from "../../services/satuanService";

export default function SatuanList() {
  const location = useLocation();
  const [satuanList, setSatuanList] = useState<Satuan[]>([]);
  const [filteredSatuan, setFilteredSatuan] = useState<Satuan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadSatuan();

    // Ambil success message dari navigation state
    if (location.state && (location.state as { success?: string }).success) {
      setSuccess((location.state as { success: string }).success);
      setTimeout(() => setSuccess(""), 3000);
      // Clear state agar tidak muncul lagi saat refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const loadSatuan = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllSatuan();
      setSatuanList(data);
      setFilteredSatuan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data satuan");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredSatuan(satuanList);
      return;
    }

    const filtered = satuanList.filter((satuan) => {
      const searchLower = value.toLowerCase();
      return (
        satuan.kode_satuan.toLowerCase().includes(searchLower) ||
        satuan.nama_satuan.toLowerCase().includes(searchLower) ||
        (satuan.deskripsi &&
          satuan.deskripsi.toLowerCase().includes(searchLower))
      );
    });

    setFilteredSatuan(filtered);
  };

  const handleDelete = async (id: number, nama: string) => {
    if (
      !window.confirm(
        `Apakah Anda yakin ingin menghapus satuan "${nama}"?\n\nPerhatian: Satuan yang sudah digunakan pada produk tidak dapat dihapus.`
      )
    ) {
      return;
    }

    try {
      await deleteSatuan(id);
      setSuccess(`Satuan "${nama}" berhasil dihapus`);
      setTimeout(() => setSuccess(""), 3000);
      loadSatuan();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus satuan");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Data Satuan</h3>
            <p className="text-subtitle text-muted">
              Kelola data satuan produk
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
                  Satuan
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
              <h5 className="card-title mb-0">Daftar Satuan</h5>
              <Link to="/satuan/tambah" className="btn btn-primary">
                <i className="bi bi-plus-circle"></i> Tambah Satuan
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
                    placeholder="Cari berdasarkan kode, nama, atau deskripsi satuan..."
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
                    Ditemukan {filteredSatuan.length} dari {satuanList.length}{" "}
                    satuan
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
                      <th style={{ width: "10%" }}>No</th>
                      <th style={{ width: "15%" }}>Kode</th>
                      <th style={{ width: "25%" }}>Nama Satuan</th>
                      <th style={{ width: "35%" }}>Deskripsi</th>
                      <th style={{ width: "15%" }} className="text-center">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSatuan.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">
                          <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                          <p className="text-muted">
                            {searchTerm
                              ? "Satuan tidak ditemukan"
                              : "Belum ada data satuan"}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredSatuan.map((satuan, index) => (
                        <tr key={satuan.id}>
                          <td>{index + 1}</td>
                          <td>
                            <code>{satuan.kode_satuan}</code>
                          </td>
                          <td>
                            <strong>{satuan.nama_satuan}</strong>
                          </td>
                          <td>
                            {satuan.deskripsi || (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Link
                                to={`/satuan/edit/${satuan.id}`}
                                className="btn btn-sm btn-warning"
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                className="btn btn-sm btn-danger"
                                title="Hapus"
                                onClick={() =>
                                  handleDelete(satuan.id, satuan.nama_satuan)
                                }
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
            {!loading && satuanList.length > 0 && (
              <div className="mt-3">
                <small className="text-muted">
                  Menampilkan {filteredSatuan.length} dari {satuanList.length}{" "}
                  satuan
                </small>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
