import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Login, Register } from "./";

export { AccountLayout };

function AccountLayout() {
  const auth = useSelector((x) => x.auth.value);
  console.log(auth);
  // redirect to home if already logged in
  if (auth && auth.role === "Auditor") {
    return <Navigate to="/audit" />;
  }

  if (auth && auth.role === "User") {
    return <Navigate to="/users" />;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-8 offset-sm-2 mt-5">
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
