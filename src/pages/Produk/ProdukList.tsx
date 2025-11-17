import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllProduk,
  deleteProduk,
  searchProduk,
  updateProdukStock,
  type Produk,
} from "../../services/produkService";

export default function ProdukList() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [success, setSuccess] = useState("");

  // State untuk modal update stok
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [stockOperation, setStockOperation] = useState<"add" | "subtract">(
    "add"
  );
  const [updatingStock, setUpdatingStock] = useState(false);
  const [stockError, setStockError] = useState("");

  useEffect(() => {
    loadProduk();
  }, []);

  const loadProduk = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllProduk();
      setProdukList(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadProduk();
      return;
    }

    try {
      setLoading(true);
      setError("");
      const result = await searchProduk(searchTerm, 50);
      setProdukList(result.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Gagal mencari produk");
    }
  };

  const handleDelete = async (id: number, namaProduk: string) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus produk "${namaProduk}"?`
      )
    ) {
      try {
        setLoading(true);
        await deleteProduk(id);
        setSuccess(`Produk "${namaProduk}" berhasil dihapus`);
        setTimeout(() => setSuccess(""), 3000);
        loadProduk();
      } catch (err) {
        setLoading(false);
        setError(err instanceof Error ? err.message : "Gagal menghapus produk");
      }
    }
  };

  const openStockModal = (produk: Produk) => {
    setSelectedProduk(produk);
    setStockQuantity(0);
    setStockOperation("add");
    setShowStockModal(true);
  };

  const closeStockModal = () => {
    setShowStockModal(false);
    setSelectedProduk(null);
    setStockQuantity(0);
  };

  const handleUpdateStock = async () => {
    if (!selectedProduk || stockQuantity <= 0) {
      setStockError("Jumlah stok harus lebih dari 0");
      return;
    }

    if (stockOperation === "subtract" && stockQuantity > selectedProduk.stok) {
      setStockError("Jumlah pengurangan melebihi stok tersedia");
      return;
    }

    try {
      setUpdatingStock(true);
      setStockError("");
      await updateProdukStock(selectedProduk.id, stockQuantity, stockOperation);

      const operationText =
        stockOperation === "add" ? "ditambahkan" : "dikurangi";
      setSuccess(
        `Stok produk "${selectedProduk.nama_produk}" berhasil ${operationText} sebanyak ${stockQuantity}`
      );
      setTimeout(() => setSuccess(""), 3000);

      closeStockModal();
      loadProduk();
    } catch (err) {
      setStockError(
        err instanceof Error ? err.message : "Gagal mengupdate stok"
      );
    } finally {
      setUpdatingStock(false);
    }
  };

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Data Produk</h3>
            <p className="text-subtitle text-muted">
              Kelola data produk di Toko Sehat
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
                  Produk
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <section className="section">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
            ></button>
          </div>
        )}

        {success && (
          <div className="alert alert-success alert-dismissible fade show">
            <i className="bi bi-check-circle me-2"></i>
            {success}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccess("")}
            ></button>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <div className="row">
              <div className="col-md-6">
                <h5 className="card-title">Daftar Produk</h5>
              </div>
              <div className="col-md-6 text-end">
                <Link to="/produk/tambah" className="btn btn-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Tambah Produk
                </Link>
              </div>
            </div>
          </div>
          <div className="card-body">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari produk berdasarkan kode atau nama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-primary" type="submit">
                  <i className="bi bi-search me-1"></i>
                  Cari
                </button>
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      loadProduk();
                    }}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Reset
                  </button>
                )}
              </div>
            </form>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              /* Table */
              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead>
                    <tr>
                      <th>Kode</th>
                      <th>Nama Produk</th>
                      <th>Kategori</th>
                      <th>Satuan</th>
                      <th>Harga Modal</th>
                      <th>Harga Jual</th>
                      <th>Stok</th>
                      <th className="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produkList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                          <p className="text-muted">
                            {searchTerm
                              ? "Produk tidak ditemukan"
                              : "Belum ada data produk"}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      produkList.map((produk) => (
                        <tr key={produk.id}>
                          <td>
                            <code>{produk.kode_produk}</code>
                          </td>
                          <td>
                            <strong>{produk.nama_produk}</strong>
                          </td>
                          <td>
                            {produk.kategori?.nama_kategori || (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            {produk.satuan?.nama_satuan || (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>Rp {produk.harga_modal?.toLocaleString("id-ID") || "-"}</td>
                          <td>Rp {produk.harga.toLocaleString("id-ID")}</td>
                          <td>
                            <span
                              className={`badge ${
                                produk.stok > 10
                                  ? "bg-success"
                                  : produk.stok > 0
                                  ? "bg-warning"
                                  : "bg-danger"
                              }`}
                            >
                              {produk.stok} {produk.satuan?.kode_satuan || ""}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-sm btn-info"
                                title="Update Stok"
                                onClick={() => openStockModal(produk)}
                              >
                                <i className="bi bi-box-seam"></i>
                              </button>
                              <Link
                                to={`/produk/edit/${produk.id}`}
                                className="btn btn-sm btn-warning"
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                className="btn btn-sm btn-danger"
                                title="Hapus"
                                onClick={() =>
                                  handleDelete(produk.id, produk.nama_produk)
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
            {!loading && produkList.length > 0 && (
              <div className="mt-3">
                <small className="text-muted">
                  Menampilkan {produkList.length} produk
                </small>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal Update Stok */}
      {showStockModal && selectedProduk && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Stok Produk</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeStockModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {stockError && (
                  <div className="alert alert-danger" role="alert">
                    {stockError}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-bold">Produk</label>
                  <p className="mb-0">{selectedProduk.nama_produk}</p>
                  <small className="text-muted">
                    Kode: {selectedProduk.kode_produk}
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Stok Saat Ini</label>
                  <p className="mb-0">
                    <span
                      className={`badge ${
                        selectedProduk.stok > 10
                          ? "bg-success"
                          : selectedProduk.stok > 0
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                    >
                      {selectedProduk.stok}{" "}
                      {selectedProduk.satuan?.kode_satuan || ""}
                    </span>
                  </p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Operasi <span className="text-danger">*</span>
                  </label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="stockOperation"
                        id="operationAdd"
                        value="add"
                        checked={stockOperation === "add"}
                        onChange={(e) =>
                          setStockOperation(
                            e.target.value as "add" | "subtract"
                          )
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="operationAdd"
                      >
                        <i className="bi bi-plus-circle text-success"></i>{" "}
                        Tambah Stok
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="stockOperation"
                        id="operationSubtract"
                        value="subtract"
                        checked={stockOperation === "subtract"}
                        onChange={(e) =>
                          setStockOperation(
                            e.target.value as "add" | "subtract"
                          )
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="operationSubtract"
                      >
                        <i className="bi bi-dash-circle text-danger"></i>{" "}
                        Kurangi Stok
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="stockQuantity" className="form-label fw-bold">
                    Jumlah <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="stockQuantity"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    min="1"
                    required
                  />
                  {stockOperation === "subtract" &&
                    stockQuantity > selectedProduk.stok && (
                      <div className="form-text text-danger">
                        <i className="bi bi-exclamation-triangle"></i> Jumlah
                        pengurangan melebihi stok tersedia
                      </div>
                    )}
                </div>

                {stockOperation === "add" && (
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle"></i> Stok akan bertambah
                    menjadi:{" "}
                    <strong>
                      {selectedProduk.stok + stockQuantity}{" "}
                      {selectedProduk.satuan?.kode_satuan || ""}
                    </strong>
                  </div>
                )}
                {stockOperation === "subtract" && (
                  <div className="alert alert-warning">
                    <i className="bi bi-info-circle"></i> Stok akan berkurang
                    menjadi:{" "}
                    <strong>
                      {selectedProduk.stok - stockQuantity}{" "}
                      {selectedProduk.satuan?.kode_satuan || ""}
                    </strong>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeStockModal}
                  disabled={updatingStock}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateStock}
                  disabled={
                    updatingStock ||
                    stockQuantity <= 0 ||
                    (stockOperation === "subtract" &&
                      stockQuantity > selectedProduk.stok)
                  }
                >
                  {updatingStock ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle"></i> Update Stok
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
