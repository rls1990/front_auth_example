import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Admin from "./pages/admin/Admin";
import { AuthProvider } from "./context/AuthContext";
import "materialize-css/dist/css/materialize.min.css";
import { useEffect } from "react";
import M from "materialize-css";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  useEffect(() => {
    M.AutoInit();
  }, []);

  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" Component={Login} />
            <Route Component={ProtectedRoute}>
              <Route path="/admin/*" Component={Admin} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
