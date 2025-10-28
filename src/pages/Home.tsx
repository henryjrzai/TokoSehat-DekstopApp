import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  // Fungsi untuk mendapatkan sapaan berdasarkan waktu
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) {
      return "Selamat Pagi";
    } else if (hour < 15) {
      return "Selamat Siang";
    } else if (hour < 18) {
      return "Selamat Sore";
    } else {
      return "Selamat Malam";
    }
  };

  return (
    <div className="page-heading">
      <div className="page-title">
        <div className="row">
          <div className="col-12 col-md-6 order-md-1 order-last">
            <h3>Dashboard</h3>
            <p className="text-subtitle text-muted">
              Toko Sehat Kabanjahe - Sistem Kasir
            </p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="card">
          <div className="card-body py-4 px-5">
            <div className="d-flex align-items-center">
              <div className="avatar avatar-xl">
                <div className="avatar-content bg-primary rounded-circle">
                  <i className="bi bi-person-circle fs-3 text-white"></i>
                </div>
              </div>
              <div className="ms-3 name">
                <h5 className="font-bold mb-1">
                  {getGreeting()}, {user?.nama || "User"}!
                </h5>
                <h6 className="text-muted mb-0">
                  @{user?.username} · {user?.hak_akses}
                </h6>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h4>Informasi Pengguna</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td className="fw-bold" width="200">
                          ID
                        </td>
                        <td>: {user?.id}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Nama</td>
                        <td>: {user?.nama}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Username</td>
                        <td>: {user?.username}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Hak Akses</td>
                        <td>
                          :{" "}
                          <span className="badge bg-primary">
                            {user?.hak_akses}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Dibuat Pada</td>
                        <td>
                          :{" "}
                          {user?.created_at
                            ? new Date(user.created_at).toLocaleString(
                                "id-ID",
                                {
                                  dateStyle: "long",
                                  timeStyle: "short",
                                }
                              )
                            : "-"}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Terakhir Update</td>
                        <td>
                          :{" "}
                          {user?.updated_at
                            ? new Date(user.updated_at).toLocaleString(
                                "id-ID",
                                {
                                  dateStyle: "long",
                                  timeStyle: "short",
                                }
                              )
                            : "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
