import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken, getAuthUser } from "@/lib/utils";

type Props = { children: React.ReactNode };

const StudentRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const token = getAuthToken();
  const user = getAuthUser<{ roles?: string[] }>();

  if (!token) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  const roles = (user?.roles || []).map((r) => r.toLowerCase());
  const isStudent = roles.includes("student");

  if (!isStudent) {
    // If admin only, send to admin; else login
    if (roles.includes("admin")) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default StudentRoute;

