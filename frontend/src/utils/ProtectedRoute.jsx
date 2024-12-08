import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({isLoggedIn}) {
  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  } else return <Outlet />;
}

export default ProtectedRoute;
