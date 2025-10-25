import { useState } from "react";
import Auth from "./layout/Auth";
import DashboardAdmin from "./layout/DashboardAdmin";

function App() {
  const [login, setLogin] = useState(true);
  return (
    <div>
      {login ? (
        <DashboardAdmin />
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;