import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";
import { useLocation, Navigate } from "react-router-dom";

function RequireAuth({ children, redirectTo, user }) {
  const location = useLocation();

  console.log(user, "inside RequireAuth");

  return user ? (
    children
  ) : (
    <Navigate to={redirectTo} state={{ path: location.pathname }} />
  );
}

export default RequireAuth;
