import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
};


export const AdminRoute = ({ children }) => {
  const { isAuthenticated, role } = useSelector((s) => s.auth);
  const location = useLocation();

  // Not logged in → login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Logged in but not admin → also login
  if (role !== "admin") {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
};


