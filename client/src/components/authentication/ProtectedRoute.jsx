import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Use generic token/role/user keys
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 🚫 Not authenticated → go to login
  if (!token || !role || !user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Wrong role → send to dashboard landing (or role-specific content)
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
