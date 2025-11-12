import { Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import Home from "@/pages/dashboard/Home";

export const publicRoutes = [
  // root redirects to the unified dashboard landing
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "profile", element: <div>Profile page (placeholder)</div> },
    ],
  },
];
