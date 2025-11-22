import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getProdukById, type Produk } from "../../services/produkService";

export default function ProdukDetail() {
  const { id } = useParams<{ id: string }>();
  const [produk, setProduk] = useState<Produk | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchProduk = async () => {
        try {
          setLoading(true);
          const data = await getProdukById(Number(id));
          setProduk(data);
          setError(null);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Gagal memuat detail produk"
          );
        } finally {
          setLoading(false);
        }
      };
      fetchProduk();
    }
  }, [id]);

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
            <div className="mt-3">
              <Link to="/produk" className="btn btn-secondary">
                <i className="bi bi-arrow-left me-2"></i> Kembali ke Daftar Produk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
