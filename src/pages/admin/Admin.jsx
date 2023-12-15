/* eslint-disable react/prop-types */
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import Users from "../users/Users";

/* eslint-disable react-hooks/exhaustive-deps */
export default function Admin() {
  const { logout, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  return (
    <>
      <nav className="grey darken-3">
        <div className="nav-wrapper">
          <Link to={"/admin"} className="brand-logo" style={{ marginLeft: 20 }}>
            Admin
          </Link>

          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>
              <Link to={"users"}>Users</Link>
            </li>
            <li>
              <Link to={"/"} onClick={() => logout()}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="users" Component={Users} />
      </Routes>
    </>
  );
}
