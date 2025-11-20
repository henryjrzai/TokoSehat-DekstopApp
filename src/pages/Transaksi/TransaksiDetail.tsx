import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getTransaksiById,
  deleteTransaksi,
  type Transaksi,
} from "../../services/transaksiService";
import { printStruk } from "../../utils/strukPrinter";

export default function TransaksiDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadTransaksi(Number(id));
    }
  }, [id]);

  const loadTransaksi = async (transaksiId: number) => {
    try {
      setLoading(true);
      const data = await getTransaksiById(transaksiId);
      console.log(data)
      setTransaksi(data);
      setError("");
    } catch (err) {
      setError("Gagal memuat detail transaksi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!transaksi) return;

    if (
      window.confirm(
        `Apakah Anda yakin ingin membatalkan transaksi #${transaksi.id}?\n\nPerhatian: Stok produk akan dikembalikan.`
      )
    ) {
      try {
        await deleteTransaksi(transaksi.id);
        alert("Transaksi berhasil dibatalkan dan stok dikembalikan");
        navigate("/transaksi");
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
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrint = () => {
    if (!transaksi) return;
    printStruk(transaksi);
  };

  if (loading) {
    return (
      <div className="page-heading">
        <div className="page-title">
          <h3>Detail Transaksi</h3>
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

  if (error || !transaksi) {
    return (
      <div className="page-heading">
        <div className="page-title">
          <h3>Detail Transaksi</h3>
        </div>
        <section className="section">
          <div className="card">
            <div className="card-body">
              <div className="alert alert-danger">
                {error || "Data tidak ditemukan"}
              </div>
              <Link to="/transaksi" className="btn btn-secondary">
                <i className="bi bi-arrow-left"></i> Kembali
              </Link>
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
            <h3>Detail Transaksi #{transaksi.id}</h3>
            <p className="text-subtitle text-muted">
              Informasi lengkap transaksi
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
                  <Link to="/transaksi">Transaksi</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Detail
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="card-title">Informasi Transaksi</h4>
                  <div className="btn-group d-print-none">
                    <button
                      onClick={handlePrint}
                      className="btn btn-primary btn-sm"
                    >
                      <i className="bi bi-printer"></i> Cetak
                    </button>
                    <button
                      onClick={handleDelete}
                      className="btn btn-danger btn-sm"
                    >
                      <i className="bi bi-x-circle"></i> Batalkan Transaksi
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {/* Transaction Info */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td width="40%">
                            <strong>Nota Transaksi</strong>
                          </td>
                          <td>
                            <span className="badge bg-secondary fs-6">
                              {transaksi.no_nota}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Tanggal</strong>
                          </td>
                          <td className="text-capitalize">
                            {formatDate(transaksi.tgl_transaksi)}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Kasir</strong>
                          </td>
                          <td>
                            <p className="text-capitalize">
                              {transaksi.kasir?.nama || "-"}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <div className="alert alert-light border">
                      <table className="table table-borderless mb-0">
                        <tbody>
                          <tr>
                            <td width="50%">
                              <strong>Total Belanja</strong>
                            </td>
                            <td className="text-end">
                              <h5 className="mb-0">
                                {formatRupiah(transaksi.harga_total)}
                              </h5>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <h5 className="mb-3">Detail Item</h5>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "5%" }}>No</th>
                        <th style={{ width: "15%" }}>Kode Produk</th>
                        <th style={{ width: "35%" }}>Nama Produk</th>
                        <th style={{ width: "15%" }} className="text-center">
                          Jumlah
                        </th>
                        <th style={{ width: "15%" }} className="text-end">
                          Harga Satuan
                        </th>
                        <th style={{ width: "15%" }} className="text-end">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaksi.items && transaksi.items.length > 0 ? (
                        transaksi.items.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>
                              <code>{item.produk?.kode_produk || "-"}</code>
                            </td>
                            <td>{item.produk?.nama_produk || "-"}</td>
                            <td className="text-center">
                              <strong>{item.jumlah}</strong> {item.produk?.satuan}
                            </td>
                            <td className="text-end">
                              {formatRupiah(item.produk?.harga || 0)}
                            </td>
                            <td className="text-end">
                              <strong>{formatRupiah(item.subtotal)}</strong>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center text-muted">
                            Tidak ada detail item
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <th colSpan={5} className="text-end">
                          Total:
                        </th>
                        <th className="text-end">
                          <h5 className="mb-0">
                            {formatRupiah(transaksi.harga_total)}
                          </h5>
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-4 d-print-none">
                  <Link to="/transaksi" className="btn btn-secondary">
                    <i className="bi bi-arrow-left"></i> Kembali ke Daftar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Print Styles */}
      <style>{`
        @media print {
          .d-print-none {
            display: none !important;
          }
          .card {
            border: none !important;
            box-shadow: none !important;
          }
          .page-heading .breadcrumb-header {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
