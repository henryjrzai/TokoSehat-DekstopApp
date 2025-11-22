import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getProdukById,
  getProdukHistory,
  addProdukStock,
  type Produk,
  type ProdukHistory,
  type AddStokRequest,
} from "../../services/produkService";

export default function ProdukDetail() {
  const { id } = useParams<{ id: string }>();
  const [produk, setProduk] = useState<Produk | null>(null);
  const [history, setHistory] = useState<ProdukHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for Add Stock Modal
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState<number | string>("");
  const [distributor, setDistributor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // State for notifications
  const [notification, setNotification] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);

  const fetchProdukData = useCallback(async () => {
    if (id) {
      try {
        // Don't set loading to true on refetch
        // setLoading(true);
        const [produkData, historyData] = await Promise.all([
          getProdukById(Number(id)),
          getProdukHistory(Number(id)),
        ]);
        setProduk(produkData);
        setHistory(historyData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Gagal memuat detail dan riwayat produk"
        );
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchProdukData();
  }, [fetchProdukData]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setQuantity("");
    setDistributor("");
    setSubmitError(null);
  };

  const handleStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !quantity || Number(quantity) <= 0) {
      setSubmitError("Kuantitas harus diisi dan lebih besar dari 0.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setNotification(null);

    try {
      const stockData: AddStokRequest = {
        quantity: Number(quantity),
        distributor: distributor || undefined,
      };
      await addProdukStock(Number(id), stockData);

      handleCloseModal();
      setNotification({
        type: "success",
        message: "Stok produk berhasil ditambahkan.",
      });
      await fetchProdukData(); // Refetch data
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal menambah stok.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-heading">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-heading">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!produk) {
    return (
      <div className="page-heading">
        <div className="alert alert-warning" role="alert">
          Produk tidak ditemukan.
        </div>
      </div>
    );
  }

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Detail Produk</h3>
            <p className="text-subtitle text-muted">
              Informasi lengkap tentang produk
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
                <li className="breadcrumb-item">
                  <Link to="/produk">Produk</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Detail
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {notification && (
        <div
          className={`alert alert-${notification.type} alert-dismissible fade show`}
          role="alert"
        >
          {notification.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setNotification(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      <section className="section">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">
              {produk.nama_produk} (<code>{produk.kode_produk}</code>)
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Kategori:</strong>{" "}
                  {produk.kategori?.nama_kategori || (
                    <span className="text-muted">-</span>
                  )}
                </p>
                <p>
                  <strong>Satuan:</strong>{" "}
                  {produk.satuan?.nama_satuan || (
                    <span className="text-muted">-</span>
                  )}
                </p>
                <p>
                  <strong>Harga Modal:</strong> Rp{" "}
                  {produk.harga_modal?.toLocaleString("id-ID") || "-"}
                </p>
                <p>
                  <strong>Harga Jual:</strong> Rp{" "}
                  {produk.harga.toLocaleString("id-ID")}
                </p>
                <p>
                  <strong>Stok:</strong>{" "}
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
                </p>
              </div>
            </div>
            <div className="mt-3 d-flex gap-2">
              <Link to="/produk" className="btn btn-secondary">
                <i className="bi bi-arrow-left me-2"></i> Kembali
              </Link>
              <button className="btn btn-primary" onClick={handleShowModal}>
                <i className="bi bi-plus-circle me-2"></i> Tambah Stok
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Riwayat Stok Produk</h5>
          </div>
          <div className="card-body">
            {history && history.history.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Stok Masuk</th>
                      <th>Distributor</th>
                      <th>Tanggal Masuk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.history.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.stok}</td>
                        <td>{item.distributor || "-"}</td>
                        <td>{item.tanggal_masuk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-light-info">
                <h4 className="alert-heading">Informasi</h4>
                <p>Belum ada riwayat stok untuk produk ini.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Add Stock Modal */}
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex={-1}
        role="dialog"
        style={{
          backgroundColor: showModal ? "rgba(0,0,0,0.5)" : "transparent",
        }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <form onSubmit={handleStockSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Tambah Stok Produk</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {submitError && (
                  <div className="alert alert-danger">{submitError}</div>
                )}
                <div className="mb-3">
                  <label htmlFor="quantity" className="form-label">
                    Jumlah Stok Masuk <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    min="1"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="distributor" className="form-label">
                    Nama Distributor (Opsional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="distributor"
                    value={distributor}
                    onChange={(e) => setDistributor(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>{" "}
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
