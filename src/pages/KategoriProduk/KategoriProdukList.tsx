import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllKategoriProduk,
  deleteKategoriProduk,
  type KategoriProduk,
} from "../../services/kategoriProdukService";

export default function KategoriProdukList() {
  const [kategoriList, setKategoriList] = useState<KategoriProduk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadKategoriProduk();
  }, []);

  const loadKategoriProduk = async () => {
    try {
      setLoading(true);
      const data = await getAllKategoriProduk();
      setKategoriList(data);
      setError("");
    } catch (err) {
      setError("Gagal memuat data kategori produk");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, nama: string) => {
    if (
      window.confirm(`Apakah Anda yakin ingin menghapus kategori "${nama}"?`)
    ) {
      try {
        await deleteKategoriProduk(id);
        loadKategoriProduk();
        alert("Kategori berhasil dihapus");
      } catch (err) {
        alert("Gagal menghapus kategori");
        console.error(err);
      }
    }
  };

  const filteredKategori = kategoriList.filter((kategori) =>
    kategori.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="page-heading">
        <div className="page-title">
          <div className="row">
            <div className="col-12 col-md-6 order-md-1 order-last">
              <h3>Kategori Produk</h3>
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
            <h3>Kategori Produk</h3>
            <p className="text-subtitle text-muted">
              Daftar semua kategori produk
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
                  Kategori Produk
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
              <div className="col-md-6">
                <Link to="/kategori-produk/tambah" className="btn btn-primary">
                  <i className="bi bi-plus-circle"></i> Tambah Kategori
                </Link>
              </div>
              <div className="col-md-6">
                <div className="float-end">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cari kategori..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
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

            {filteredKategori.length === 0 ? (
              <div className="alert alert-info">
                {searchTerm
                  ? "Tidak ada kategori yang ditemukan"
                  : "Belum ada data kategori produk"}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th style={{ width: "5%" }}>No</th>
                      <th style={{ width: "25%" }}>Nama Kategori</th>
                      <th style={{ width: "50%" }}>Deskripsi</th>
                      <th style={{ width: "20%" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKategori.map((kategori, index) => (
                      <tr key={kategori.id}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{kategori.nama_kategori}</strong>
                        </td>
                        <td>
                          {kategori.deskripsi || (
                            <span className="text-muted fst-italic">
                              Tidak ada deskripsi
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <Link
                              to={`/kategori-produk/edit/${kategori.id}`}
                              className="btn btn-sm btn-warning"
                              title="Edit"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Link>
                            <button
                              onClick={() =>
                                handleDelete(
                                  kategori.id,
                                  kategori.nama_kategori
                                )
                              }
                              className="btn btn-sm btn-danger"
                              title="Hapus"
                            >
                              <i className="bi bi-trash"></i>
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
