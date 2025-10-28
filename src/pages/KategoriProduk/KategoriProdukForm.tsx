import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createKategoriProduk,
  updateKategoriProduk,
  getKategoriProdukById,
  type KategoriProdukRequest,
} from "../../services/kategoriProdukService";

interface FormData {
  nama_kategori: string;
  deskripsi: string;
}

export default function KategoriProdukForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<FormData>({
    nama_kategori: "",
    deskripsi: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditMode && id) {
      loadKategoriProduk(Number(id));
    }
  }, [id, isEditMode]);

  const loadKategoriProduk = async (kategoriId: number) => {
    try {
      setLoading(true);
      const data = await getKategoriProdukById(kategoriId);
      setFormData({
        nama_kategori: data.nama_kategori,
        deskripsi: data.deskripsi || "",
      });
    } catch (err) {
      setError("Gagal memuat data kategori");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.nama_kategori.trim()) {
      setError("Nama kategori harus diisi");
      return;
    }

    try {
      setLoading(true);

      const submitData: KategoriProdukRequest = {
        nama_kategori: formData.nama_kategori,
        deskripsi: formData.deskripsi || undefined,
      };

      if (isEditMode && id) {
        await updateKategoriProduk(Number(id), submitData);
        alert("Kategori berhasil diperbarui");
      } else {
        await createKategoriProduk(submitData);
        alert("Kategori berhasil ditambahkan");
      }

      navigate("/kategori-produk");
    } catch (err: unknown) {
      console.error("Error submitting form:", err);

      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: {
            status?: number;
            data?: {
              errors?: Record<string, string[]>;
              message?: string;
            };
          };
        };

        if (axiosError.response?.status === 422) {
          const errors = axiosError.response.data?.errors;
          if (errors) {
            const errorMessages = Object.values(errors).flat().join(", ");
            setError(errorMessages);
          } else {
            setError(axiosError.response.data?.message || "Validasi gagal");
          }
        } else if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
        } else {
          setError("Terjadi kesalahan saat menyimpan data");
        }
      } else {
        setError("Terjadi kesalahan saat menyimpan data");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>{isEditMode ? "Edit" : "Tambah"} Kategori Produk</h3>
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
                  <Link to="/kategori-produk">Kategori Produk</Link>
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
            <h4 className="card-title">
              {isEditMode ? "Edit" : "Tambah"} Kategori Produk
            </h4>
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

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12">
                  <div className="mb-3">
                    <label htmlFor="nama_kategori" className="form-label">
                      Nama Kategori <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nama_kategori"
                      name="nama_kategori"
                      value={formData.nama_kategori}
                      onChange={handleChange}
                      placeholder="Masukkan nama kategori"
                      required
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="mb-3">
                    <label htmlFor="deskripsi" className="form-label">
                      Deskripsi
                    </label>
                    <textarea
                      className="form-control"
                      id="deskripsi"
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleChange}
                      placeholder="Masukkan deskripsi kategori (opsional)"
                      rows={4}
                    />
                    <small className="text-muted">
                      Deskripsi kategori bersifat opsional
                    </small>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
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
                      <i className="bi bi-save"></i> Simpan
                    </>
                  )}
                </button>
                <Link to="/kategori-produk" className="btn btn-secondary">
                  <i className="bi bi-x-circle"></i> Batal
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
