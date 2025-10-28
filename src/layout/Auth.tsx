import { useState, FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error
    setError("");

    // Validasi input
    if (!username || !password) {
      setError("Username dan password harus diisi");
      return;
    }

    try {
      setLoading(true);
      await login({ username, password });
      // Login berhasil, akan otomatis redirect karena state berubah
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof Error ? err.message : "Login gagal. Silakan coba lagi."
      );
    }
  };

  return (
    <div id="auth">
      <div className="row vh-100 justify-content-center align-items-center">
        <div className="col-lg-5 col-12">
          <div id="auth-left">
            <h1 className="auth-title text-center">Toko Sehat Kabanjahe</h1>

            {error && (
              <div
                className="alert alert-danger alert-dismissible fade show mt-4"
                role="alert"
              >
                {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError("")}
                  aria-label="Close"
                ></button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5">
              <div className="form-group position-relative has-icon-left mb-4">
                <input
                  type="text"
                  className="form-control form-control-xl"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
                <div className="form-control-icon">
                  <i className="bi bi-person"></i>
                </div>
              </div>
              <div className="form-group position-relative has-icon-left mb-4">
                <input
                  type="password"
                  className="form-control form-control-xl"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <div className="form-control-icon">
                  <i className="bi bi-shield-lock"></i>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg shadow-lg mt-5"
                disabled={loading}
              >
                {loading ? "Loading..." : "Log in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
