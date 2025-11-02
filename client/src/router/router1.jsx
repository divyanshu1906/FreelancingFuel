import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ClientDashboard from "../pages/clients/ClientDashboard";
import FreelancerDashboard from "../pages/freelancer/FreelancerDashboard";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/client/dashboard",
    element: <ClientDashboard />,
  },
  {
    path: "/freelancer/dashboard",
    element: <FreelancerDashboard />,
  },
]);

export default router;
