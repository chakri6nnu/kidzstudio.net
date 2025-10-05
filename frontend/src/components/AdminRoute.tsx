import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken, getAuthUser } from "@/lib/utils";

type Props = { children: React.ReactNode };

const AdminRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const token = getAuthToken();
  const user = getAuthUser<{ roles?: string[] }>();

  if (!token) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  const roles = (user?.roles || []).map((r) => r.toLowerCase());
  const isAdmin = roles.includes("admin");
  if (!isAdmin) {
    // If user is not admin but is student, send to student dashboard; otherwise to login
    if (roles.includes("student")) {
      return <Navigate to="/student/dashboard" replace />;
    }
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default AdminRoute;
