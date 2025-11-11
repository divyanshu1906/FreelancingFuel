import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // 🟢 Get the user info from either role
  const clientUser = JSON.parse(localStorage.getItem("client_user") || "null");
  const freelancerUser = JSON.parse(localStorage.getItem("freelancer_user") || "null");

  // 🟢 Determine which user is logged in
  const user = clientUser || freelancerUser;

  // 🟢 Get the corresponding token
  const token =
    user?.role === "client"
      ? localStorage.getItem("client_token")
      : user?.role === "freelancer"
      ? localStorage.getItem("freelancer_token")
      : null;

  // 🚫 No user or token → redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Wrong role → redirect to correct dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  // ✅ All good → render the protected page
  return children;
};

export default ProtectedRoute;
