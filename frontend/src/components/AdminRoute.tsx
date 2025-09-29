import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken } from "@/lib/utils";

type Props = { children: React.ReactNode };

const AdminRoute: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default AdminRoute;
