import PublicDashboard from "@/pages/dashboard/PublicDashboard";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

export const publicRoutes = [
  { path: "/", element: <PublicDashboard /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
];
