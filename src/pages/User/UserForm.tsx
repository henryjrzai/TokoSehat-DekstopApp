import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  registerUser,
  updateUser,
  getUserById,
  type UserRegisterRequest,
  type UserUpdateRequest,
} from "../../services/userService";

export default function UserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<UserRegisterRequest>({
    nama: "",
    username: "",
    password: "",
    hak_akses: "kasir",
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      loadUserData(Number(id));
    }
  }, [id, isEditMode]);

  const loadUserData = async (userId: number) => {
    try {
      setLoadingData(true);
      setError("");
      const data = await getUserById(userId);
      setFormData({
        nama: data.nama,
        username: data.username,
        password: "", // Password tidak di-load untuk security
        hak_akses: data.hak_akses,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data user");
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
    if (!formData.nama.trim()) {
      setError("Nama harus diisi");
      return;
    }

    if (!formData.username.trim()) {
      setError("Username harus diisi");
      return;
    }

    if (!isEditMode && !formData.password.trim()) {
      setError("Password harus diisi");
      return;
    }

    if (!isEditMode && formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode && id) {
        // Update user (tanpa password)
        const updateData: UserUpdateRequest = {
          nama: formData.nama,
          username: formData.username,
          hak_akses: formData.hak_akses,
        };
        await updateUser(Number(id), updateData);
      } else {
        // Register user baru
        console.log("Sending data:", formData); // Debug log
        await registerUser(formData);
      }

      navigate("/user", {
        state: {
          success: `User "${formData.nama}" berhasil ${
            isEditMode ? "diperbarui" : "ditambahkan"
          }`,
        },
      });
    } catch (err) {
      console.error("Error details:", err); // Debug log
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";

      // Parse error message jika dari axios
      if (
        errorMessage.includes("403") ||
        errorMessage.toLowerCase().includes("only admin")
      ) {
        setError("Hanya Admin yang dapat menambahkan user baru");
      } else if (
        errorMessage.includes("422") ||
        errorMessage.toLowerCase().includes("validation")
      ) {
        setError("Data tidak valid. Periksa kembali form Anda");
      } else if (
        errorMessage.includes("username") &&
        errorMessage.toLowerCase().includes("taken")
      ) {
        setError("Username sudah digunakan, gunakan username lain");
      } else {
        setError(
          errorMessage ||
            `Gagal ${isEditMode ? "memperbarui" : "menambahkan"} user`
        );
      }
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
            <h3>{isEditMode ? "Edit User" : "Tambah User"}</h3>
            <p className="text-subtitle text-muted">
              {isEditMode
                ? "Perbarui data pengguna sistem"
                : "Tambahkan pengguna sistem baru"}
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
                  <Link to="/user">User</Link>
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
              {isEditMode ? "Form Edit User" : "Form Tambah User"}
            </h5>
          </div>
          <div className="card-body">
            {/* Info untuk user baru */}
            {!isEditMode && (
              <div className="alert alert-warning">
                <i className="bi bi-info-circle"></i>
                <strong> Perhatian:</strong> Hanya user dengan hak akses{" "}
                <strong>Admin</strong> yang dapat menambahkan user baru.
              </div>
            )}

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
                {/* Nama */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="nama" className="form-label">
                    Nama Lengkap <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Contoh: John Doe"
                    required
                    maxLength={255}
                  />
                </div>

                {/* Username */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="username" className="form-label">
                    Username <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Contoh: johndoe"
                    required
                    maxLength={255}
                  />
                  <div className="form-text">
                    Username harus unik dan tidak boleh sama dengan user lain
                  </div>
                </div>

                {/* Password - Hanya untuk tambah user baru */}
                {!isEditMode && (
                  <div className="col-md-6 mb-3">
                    <label htmlFor="password" className="form-label">
                      Password <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Minimal 6 karakter"
                        required={!isEditMode}
                        minLength={6}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i
                          className={`bi bi-eye${showPassword ? "-slash" : ""}`}
                        ></i>
                      </button>
                    </div>
                    <div className="form-text">Password minimal 6 karakter</div>
                  </div>
                )}

                {/* Hak Akses */}
                <div className={`col-md-${isEditMode ? "12" : "6"} mb-3`}>
                  <label htmlFor="hak_akses" className="form-label">
                    Hak Akses <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="hak_akses"
                    name="hak_akses"
                    value={formData.hak_akses}
                    onChange={handleChange}
                    required
                  >
                    <option value="kasir">Kasir</option>
                    <option value="admin">Admin</option>
                    <option value="pemilik">Pemilik</option>
                  </select>
                  <div className="form-text">
                    <strong>Kasir:</strong> Hanya dapat melakukan transaksi
                    penjualan
                    <br />
                    <strong>Admin:</strong> Dapat mengelola data master dan user
                    <br />
                    <strong>Pemilik:</strong> Akses penuh termasuk laporan
                  </div>
                </div>

                {isEditMode && (
                  <div className="col-12">
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle"></i>
                      <strong> Note:</strong> Password tidak dapat diubah
                      melalui form ini. Gunakan fitur "Ubah Password" untuk
                      mengganti password.
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <Link to="/user" className="btn btn-secondary">
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
