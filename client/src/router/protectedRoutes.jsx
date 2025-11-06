import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import ClientDashboard from "@/pages/clients/ClientDashboard";
import FreelancerDashboard from "@/pages/freelancer/FreelancerDashboard";
import CreateProject from "@/pages/clients/CreateProject";
import UpdateProject from "@/pages/clients/UpdateProject";
import ApplyApplication from "@/pages/freelancer/ApplyApplication";

export const protectedRoutes = [
  {
    path: "/client/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["client"]}>
        <ClientDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/freelancer/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["freelancer"]}>
        <FreelancerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/client/create-project",
    element: (
      <ProtectedRoute allowedRoles={["client"]}>
        <CreateProject />
      </ProtectedRoute>
    ),
  },
  {
    path: "/client/update-project/:projectId",
    element: (
      <ProtectedRoute allowedRoles={["client"]}>
        <UpdateProject />
      </ProtectedRoute>
    ),
  },
  {
    path: "/freelancer/apply/:projectId",
    element: (
      <ProtectedRoute allowedRoles={["freelancer"]}>
        <ApplyApplication />
      </ProtectedRoute>
    ),
  },
];
