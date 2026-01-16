import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getAllTransaksi,
  deleteTransaksi,
  type Transaksi,
  type PaginationData,
} from "../../services/transaksiService";

export default function TransaksiList() {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchNoNota, setSearchNoNota] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const loadTransaksi = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllTransaksi({
        date: filterDate || undefined,
        noNota: searchNoNota || undefined,
        per_page: perPage,
        page: currentPage,
      });
      setTransaksiList(response.data);
      setPagination(response.pagination);
      setError("");
    } catch (err) {
      setError("Gagal memuat data transaksi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, filterDate, searchNoNota]);

  useEffect(() => {
    loadTransaksi();
  }, [loadTransaksi]);

  const handleDelete = async (id: number, tanggal: string) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin membatalkan transaksi tanggal ${new Date(
          tanggal
        ).toLocaleString(
          "id-ID"
        )}?\n\nPerhatian: Stok produk akan dikembalikan.`
      )
    ) {
      try {
        await deleteTransaksi(id);
        loadTransaksi();
        alert("Transaksi berhasil dibatalkan dan stok dikembalikan");
      } catch (err) {
        alert("Gagal membatalkan transaksi");
        console.error(err);
      }
    }
  };

  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadTransaksi();
  };

  const handleReset = () => {
    setSearchNoNota("");
    setFilterDate("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="page-heading">
        <div className="page-title">
          <div className="row">
            <div className="col-12 col-md-6 order-md-1 order-last">
              <h3>Transaksi</h3>
            </div>
          </div>
        </div>
        <section className="section">
          <div className="card">
            <div className="card-body">
              <p>Memuat data...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Riwayat Transaksi</h3>
            <p className="text-subtitle text-muted">
              Daftar semua transaksi penjualan
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
                  Transaksi
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="card">
          <div className="card-header">
            <div className="row align-items-end">
              <div className="col-md-3">
                <label className="form-label">Nomor Nota</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari nomor nota..."
                  value={searchNoNota}
                  onChange={(e) => setSearchNoNota(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Tanggal</label>
                <input
                  type="date"
                  className="form-control"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Per Halaman</label>
                <select
                  className="form-select"
                  value={perPage}
                  onChange={(e) => handlePerPageChange(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="col-md-4">
                {(searchNoNota || filterDate) && (
                  <button
                    className="btn btn-secondary"
                    onClick={handleReset}
                  >
                    <i className="bi bi-x-circle"></i> Reset Filter
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger alert-dismissible fade show">
                {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError("")}
                ></button>
              </div>
            )}

            {transaksiList.length === 0 ? (
              <div className="alert alert-info">
                {searchNoNota || filterDate
                  ? "Tidak ada transaksi yang ditemukan"
                  : "Belum ada data transaksi"}
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th style={{ width: "5%" }}>No</th>
                        <th style={{ width: "10%" }}>No Nota</th>
                        <th style={{ width: "20%" }}>Tanggal</th>
                        <th style={{ width: "15%" }}>Kasir</th>
                        <th style={{ width: "10%" }}>Jumlah Item</th>
                        <th style={{ width: "15%" }}>Total</th>
                        <th style={{ width: "15%" }}>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaksiList.map((transaksi, index) => (
                        <tr key={transaksi.id}>
                          <td>
                            {pagination
                              ? (currentPage - 1) * perPage + index + 1
                              : index + 1}
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {transaksi.no_nota}
                            </span>
                          </td>
                          <td>{formatDate(transaksi.tgl_transaksi)}</td>
                          <td>{transaksi.kasir?.nama || "-"}</td>
                          <td>
                            <span className="badge bg-info">
                              {transaksi.total_item || 0} item
                            </span>
                          </td>
                          <td>
                            <strong>{formatRupiah(transaksi.harga_total)}</strong>
                          </td>
                        <td>
                          <div className="btn-group" role="group">
                            <Link
                              to={`/transaksi/detail/${transaksi.id}`}
                              className="btn btn-sm btn-info"
                              title="Detail"
                            >
                              <i className="bi bi-eye"></i>
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(transaksi.id, transaksi.tgl_transaksi)
                              }
                              className="btn btn-sm btn-danger"
                              title="Batalkan Transaksi"
                            >
                              <i className="bi bi-x-circle"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>

                {pagination && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <p className="text-muted mb-0">
                        Menampilkan {(currentPage - 1) * perPage + 1} -{" "}
                        {Math.min(currentPage * perPage, pagination.total)} dari{" "}
                        {pagination.total} transaksi
                      </p>
                    </div>
                    <nav>
                      <ul className="pagination mb-0">
                        <li
                          className={`page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <i className="bi bi-chevron-left"></i>
                          </button>
                        </li>

                        {/* First page */}
                        {currentPage > 3 && (
                          <>
                            <li className="page-item">
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(1)}
                              >
                                1
                              </button>
                            </li>
                            {currentPage > 4 && (
                              <li className="page-item disabled">
                                <span className="page-link">...</span>
                              </li>
                            )}
                          </>
                        )}

                        {/* Pages around current */}
                        {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                          .filter(
                            (page) =>
                              page === currentPage ||
                              page === currentPage - 1 ||
                              page === currentPage - 2 ||
                              page === currentPage + 1 ||
                              page === currentPage + 2
                          )
                          .map((page) => (
                            <li
                              key={page}
                              className={`page-item ${
                                currentPage === page ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </button>
                            </li>
                          ))}

                        {/* Last page */}
                        {currentPage < pagination.last_page - 2 && (
                          <>
                            {currentPage < pagination.last_page - 3 && (
                              <li className="page-item disabled">
                                <span className="page-link">...</span>
                              </li>
                            )}
                            <li className="page-item">
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(pagination.last_page)}
                              >
                                {pagination.last_page}
                              </button>
                            </li>
                          </>
                        )}

                        <li
                          className={`page-item ${
                            currentPage === pagination.last_page ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pagination.last_page}
                          >
                            <i className="bi bi-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
