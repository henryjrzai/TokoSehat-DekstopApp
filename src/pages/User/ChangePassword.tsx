import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  changePassword,
  getUserById,
  type ChangePasswordRequest,
} from "../../services/userService";

export default function ChangePassword() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [formData, setFormData] = useState<ChangePasswordRequest>({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (id) {
      loadUserName(Number(id));
    }
  }, [id]);

  const loadUserName = async (userId: number) => {
    try {
      const data = await getUserById(userId);
      setUserName(data.nama);
    } catch (err) {
      console.error("Error loading user:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!formData.current_password) {
      setError("Password lama harus diisi");
      return;
    }

    if (!formData.new_password) {
      setError("Password baru harus diisi");
      return;
    }

    if (formData.new_password.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }

    if (formData.new_password !== formData.new_password_confirmation) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    if (formData.current_password === formData.new_password) {
      setError("Password baru harus berbeda dengan password lama");
      return;
    }

    if (!id) {
      setError("ID user tidak valid");
      return;
    }

    try {
      setLoading(true);
      await changePassword(Number(id), formData);

      navigate("/user", {
        state: {
          success: `Password user "${userName}" berhasil diubah`,
        },
      });
    } catch (err) {
      console.error("Error changing password:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";

      if (
        errorMessage.toLowerCase().includes("current password") ||
        errorMessage.toLowerCase().includes("password lama")
      ) {
        setError("Password lama tidak sesuai");
      } else if (errorMessage.toLowerCase().includes("confirmation")) {
        setError("Konfirmasi password tidak cocok");
      } else {
        setError(errorMessage || "Gagal mengubah password");
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
            <h3>Ubah Password</h3>
            <p className="text-subtitle text-muted">
              Ubah password untuk user: <strong>{userName || "..."}</strong>
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
                  Ubah Password
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Form Ubah Password</h5>
              </div>
              <div className="card-body">
                {/* Alert Info */}
                <div className="alert alert-info">
                  <i className="bi bi-info-circle"></i>
                  <strong> Perhatian:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Password baru minimal 6 karakter</li>
                    <li>Pastikan password baru berbeda dengan password lama</li>
                    <li>Konfirmasi password harus sama dengan password baru</li>
                  </ul>
                </div>

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
                  {/* Password Lama */}
                  <div className="mb-3">
                    <label htmlFor="current_password" className="form-label">
                      Password Lama <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        className="form-control"
                        id="current_password"
                        name="current_password"
                        value={formData.current_password}
                        onChange={handleChange}
                        placeholder="Masukkan password lama"
                        required
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        <i
                          className={`bi bi-eye${
                            showCurrentPassword ? "-slash" : ""
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  {/* Password Baru */}
                  <div className="mb-3">
                    <label htmlFor="new_password" className="form-label">
                      Password Baru <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className="form-control"
                        id="new_password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        placeholder="Minimal 6 karakter"
                        required
                        minLength={6}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        <i
                          className={`bi bi-eye${
                            showNewPassword ? "-slash" : ""
                          }`}
                        ></i>
                      </button>
                    </div>
                    <div className="form-text">Password minimal 6 karakter</div>
                  </div>

                  {/* Konfirmasi Password Baru */}
                  <div className="mb-3">
                    <label
                      htmlFor="new_password_confirmation"
                      className="form-label"
                    >
                      Konfirmasi Password Baru{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        id="new_password_confirmation"
                        name="new_password_confirmation"
                        value={formData.new_password_confirmation}
                        onChange={handleChange}
                        placeholder="Ketik ulang password baru"
                        required
                        minLength={6}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <i
                          className={`bi bi-eye${
                            showConfirmPassword ? "-slash" : ""
                          }`}
                        ></i>
                      </button>
                    </div>
                    {formData.new_password &&
                      formData.new_password_confirmation && (
                        <div
                          className={`form-text ${
                            formData.new_password ===
                            formData.new_password_confirmation
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {formData.new_password ===
                          formData.new_password_confirmation ? (
                            <>
                              <i className="bi bi-check-circle"></i> Password
                              cocok
                            </>
                          ) : (
                            <>
                              <i className="bi bi-x-circle"></i> Password tidak
                              cocok
                            </>
                          )}
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
                      disabled={
                        loading ||
                        formData.new_password !==
                          formData.new_password_confirmation
                      }
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Mengubah Password...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-key"></i> Ubah Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
