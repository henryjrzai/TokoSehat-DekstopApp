import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllTransaksi,
  deleteTransaksi,
  type Transaksi,
} from "../../services/transaksiService";

export default function TransaksiList() {
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    loadTransaksi();
  }, []);

  const loadTransaksi = async () => {
    try {
      setLoading(true);
      const data = await getAllTransaksi();
      // Sort by newest first
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.created_at || b.tgl_transaksi).getTime() -
          new Date(a.created_at || a.tgl_transaksi).getTime()
      );
      setTransaksiList(sortedData);
      setError("");
    } catch (err) {
      setError("Gagal memuat data transaksi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredTransaksi = transaksiList.filter((transaksi) => {
    const matchSearch =
      transaksi.kasir?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaksi.id.toString().includes(searchTerm);

    const matchDate = filterDate
      ? new Date(transaksi.tgl_transaksi).toDateString() ===
        new Date(filterDate).toDateString()
      : true;

    return matchSearch && matchDate;
  });

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
            <div className="row">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari ID atau nama kasir..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="date"
                  className="form-control"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                {(searchTerm || filterDate) && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterDate("");
                    }}
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

            {filteredTransaksi.length === 0 ? (
              <div className="alert alert-info">
                {searchTerm || filterDate
                  ? "Tidak ada transaksi yang ditemukan"
                  : "Belum ada data transaksi"}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: "5%" }}>No</th>
                      <th style={{ width: "10%" }}>No Nota</th>
                      <th style={{ width: "20%" }}>Tanggal</th>
                      <th style={{ width: "15%" }}>Kasir</th>
                      <th style={{ width: "15%" }}>Total</th>
                      <th style={{ width: "15%" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransaksi.map((transaksi, index) => (
                      <tr key={transaksi.id}>
                        <td>{index + 1}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {transaksi.no_nota}
                          </span>
                        </td>
                        <td>{formatDate(transaksi.tgl_transaksi)}</td>
                        <td>{transaksi.kasir?.nama || "-"}</td>
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
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
