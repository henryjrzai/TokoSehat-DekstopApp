import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createProduk,
  updateProduk,
  getProdukById,
  type ProdukRequest,
} from "../../services/produkService";
import {
  getAllKategoriProduk,
  type KategoriProduk,
} from "../../services/kategoriProdukService";
import { getAllSatuan, type Satuan } from "../../services/satuanService";

export default function ProdukForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<ProdukRequest>({
    satuan_id: 0,
    kategori_id: 0,
    kode_produk: "",
    nama_produk: "",
    harga_modal: 0,
    harga: 0,
    stok: 0,
  });

  const [kategoriList, setKategoriList] = useState<KategoriProduk[]>([]);
  const [satuanList, setSatuanList] = useState<Satuan[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDropdownData();
    if (isEditMode && id) {
      loadProdukData(parseInt(id));
    }
  }, [id, isEditMode]);

  const loadDropdownData = async () => {
    try {
      const [kategori, satuan] = await Promise.all([
        getAllKategoriProduk(),
        getAllSatuan(),
      ]);
      setKategoriList(kategori);
      setSatuanList(satuan);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat data dropdown"
      );
    }
  };

  const loadProdukData = async (produkId: number) => {
    try {
      setLoadingData(true);
      const data = await getProdukById(produkId);
      setFormData({
        satuan_id: data.satuan?.id ?? 0,
        kategori_id: data.kategori?.id ?? 0,
        kode_produk: data.kode_produk,
        nama_produk: data.nama_produk,
        harga_modal: data.harga_modal,
        harga: data.harga,
        stok: data.stok,
      });
      setLoadingData(false);
    } catch (err) {
      setLoadingData(false);
      setError(err instanceof Error ? err.message : "Gagal memuat data produk");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "satuan_id" ||
        name === "kategori_id" ||
        name === "harga_modal" ||
        name === "harga" ||
        name === "stok"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi
    if (!formData.kode_produk || !formData.nama_produk) {
      setError("Kode produk dan nama produk harus diisi");
      return;
    }
    if (formData.kategori_id === 0 || formData.satuan_id === 0) {
      setError("Kategori dan satuan harus dipilih");
      return;
    }
    if (formData.harga_modal <= 0) {
      setError("Harga modal harus lebih dari 0");
      return;
    }
    if (formData.harga <= 0) {
      setError("Harga harus lebih dari 0");
      return;
    }
    if (formData.stok < 0) {
      setError("Stok tidak boleh negatif");
      return;
    }

    try {
      setLoading(true);
      if (isEditMode && id) {
        await updateProduk(parseInt(id), formData);
      } else {
        await createProduk(formData);
      }
      navigate("/produk");
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Gagal menyimpan data");
    }
  };

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>{isEditMode ? "Edit Produk" : "Tambah Produk"}</h3>
            <p className="text-subtitle text-muted">
              {isEditMode ? "Perbarui data produk" : "Tambahkan produk baru"}
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
                  {isEditMode ? "Edit" : "Tambah"}
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

        <div className="card">
          <div className="card-header">
            <h5 className="card-title">
              {isEditMode ? "Form Edit Produk" : "Form Tambah Produk"}
            </h5>
          </div>
          <div className="card-body">
            {loadingData ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Memuat data produk...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">
                        Kode Produk <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="kode_produk"
                        value={formData.kode_produk}
                        onChange={handleChange}
                        placeholder="Contoh: PRD001"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">
                        Nama Produk <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="nama_produk"
                        value={formData.nama_produk}
                        onChange={handleChange}
                        placeholder="Contoh: Paracetamol 500mg"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">
                        Kategori <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="kategori_id"
                        value={formData.kategori_id}
                        onChange={handleChange}
                        required
                      >
                        <option value={0}>Pilih Kategori</option>
                        {kategoriList.map((kategori) => (
                          <option key={kategori.id} value={kategori.id}>
                            {kategori.nama_kategori}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">
                        Satuan <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="satuan_id"
                        value={formData.satuan_id}
                        onChange={handleChange}
                        required
                      >
                        <option value={0}>Pilih Satuan</option>
                        {satuanList.map((satuan) => (
                          <option key={satuan.id} value={satuan.id}>
                            {satuan.nama_satuan} ({satuan.kode_satuan})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">
                        Harga Modal <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">Rp</span>
                        <input
                          type="number"
                          className="form-control"
                          name="harga_modal"
                          value={formData.harga_modal}
                          onChange={handleChange}
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">
                        Harga <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">Rp</span>
                        <input
                          type="number"
                          className="form-control"
                          name="harga"
                          value={formData.harga}
                          onChange={handleChange}
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label className="form-label">
                        Stok <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="stok"
                        value={formData.stok}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        required
                        disabled={isEditMode}
                        readOnly={isEditMode}
                      />
                      {isEditMode && (
                        <small className="form-text text-muted">
                          <i className="bi bi-info-circle me-1"></i>
                          Stok tidak dapat diubah di form edit. Gunakan fitur
                          update stok khusus.
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <Link to="/produk" className="btn btn-secondary">
                    <i className="bi bi-arrow-left me-2"></i>
                    Kembali
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2"></i>
                        {isEditMode ? "Update Produk" : "Simpan Produk"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
