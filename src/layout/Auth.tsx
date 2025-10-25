export default function Auth() {
  return (
    <div id="auth">
      <div className="row vh-100 justify-content-center align-items-center">
        <div className="col-lg-5 col-12">
          <div id="auth-left">
            <h1 className="auth-title text-center">Toko Sehat Kabanjahe</h1>
            <form action="index.html" className="mt-5">
              <div className="form-group position-relative has-icon-left mb-4">
                <input
                  type="text"
                  className="form-control form-control-xl"
                  placeholder="Username"
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
                />
                <div className="form-control-icon">
                  <i className="bi bi-shield-lock"></i>
                </div>
              </div>
              <button className="btn btn-primary btn-block btn-lg shadow-lg mt-5">
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}