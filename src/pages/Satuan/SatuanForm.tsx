import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createSatuan,
  updateSatuan,
  getSatuanById,
  SatuanRequest,
} from "../../services/satuanService";

export default function SatuanForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<SatuanRequest>({
    kode_satuan: "",
    nama_satuan: "",
    deskripsi: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditMode && id) {
      loadSatuanData(Number(id));
    }
  }, [id, isEditMode]);

  const loadSatuanData = async (satuanId: number) => {
    try {
      setLoadingData(true);
      setError("");
      const data = await getSatuanById(satuanId);
      setFormData({
        kode_satuan: data.kode_satuan,
        nama_satuan: data.nama_satuan,
        deskripsi: data.deskripsi || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data satuan");
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi
    if (!formData.kode_satuan.trim()) {
      setError("Kode satuan harus diisi");
      return;
    }

    if (!formData.nama_satuan.trim()) {
      setError("Nama satuan harus diisi");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode && id) {
        await updateSatuan(Number(id), formData);
      } else {
        await createSatuan(formData);
      }

      navigate("/satuan", {
        state: {
          success: `Satuan "${formData.nama_satuan}" berhasil ${
            isEditMode ? "diperbarui" : "ditambahkan"
          }`,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Gagal ${isEditMode ? "memperbarui" : "menambahkan"} satuan`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="page-heading">
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-3">Memuat data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>{isEditMode ? "Edit Satuan" : "Tambah Satuan"}</h3>
            <p className="text-subtitle text-muted">
              {isEditMode
                ? "Perbarui data satuan produk"
                : "Tambahkan satuan produk baru"}
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
                  <Link to="/satuan">Satuan</Link>
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
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              {isEditMode ? "Form Edit Satuan" : "Form Tambah Satuan"}
            </h5>
          </div>
          <div className="card-body">
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

            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Kode Satuan */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="kode_satuan" className="form-label">
                    Kode Satuan <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="kode_satuan"
                    name="kode_satuan"
                    value={formData.kode_satuan}
                    onChange={handleChange}
                    placeholder="Contoh: PCS, KG, LITER"
                    required
                    maxLength={10}
                  />
                  <div className="form-text">
                    Kode singkat untuk satuan (maksimal 10 karakter)
                  </div>
                </div>

                {/* Nama Satuan */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="nama_satuan" className="form-label">
                    Nama Satuan <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nama_satuan"
                    name="nama_satuan"
                    value={formData.nama_satuan}
                    onChange={handleChange}
                    placeholder="Contoh: Pieces, Kilogram, Liter"
                    required
                    maxLength={50}
                  />
                  <div className="form-text">
                    Nama lengkap satuan (maksimal 50 karakter)
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="col-12 mb-3">
                  <label htmlFor="deskripsi" className="form-label">
                    Deskripsi
                  </label>
                  <textarea
                    className="form-control"
                    id="deskripsi"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    placeholder="Deskripsi atau keterangan tambahan (opsional)"
                    rows={3}
                    maxLength={255}
                  ></textarea>
                  <div className="form-text">
                    Keterangan tambahan tentang satuan (opsional, maksimal 255
                    karakter)
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <Link to="/satuan" className="btn btn-secondary">
                  <i className="bi bi-arrow-left"></i> Kembali
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
                        aria-hidden="true"
                      ></span>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save"></i>{" "}
                      {isEditMode ? "Update" : "Simpan"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
