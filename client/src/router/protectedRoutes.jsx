import ProtectedRoute from "@/components/authentication/ProtectedRoute";
import ClientDashboard from "@/pages/clients/ClientDashboard";
import FreelancerDashboard from "@/pages/freelancer/FreelancerDashboard";
import CreateProject from "@/pages/clients/CreateProject";
import UpdateProject from "@/pages/clients/UpdateProject";
import ApplyApplication from "@/pages/freelancer/ApplyApplication";
import ChatRoom from "@/pages/clients/ChatRoom";
import ClientChats from "@/pages/clients/ClientChats";
import FreelancerChats from "@/pages/freelancer/FreelancerChats";


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
    path: "/client/chats",
    element: (
      <ProtectedRoute allowedRoles={["client"]}>
        <ClientChats />
      </ProtectedRoute>
    ),
  },
  {
    path: "/client/chats/:projectId",
    element: (
      <ProtectedRoute allowedRoles={["client"]}>
        <ClientChats />
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
  {
    path: "/freelancer/chats",
    element: (
      <ProtectedRoute allowedRoles={["freelancer"]}>
        <FreelancerChats />
      </ProtectedRoute>
    ),
  },
  {
    path: "/freelancer/chats/:projectId",
    element: (
      <ProtectedRoute allowedRoles={["freelancer"]}>
        <FreelancerChats />
      </ProtectedRoute>
    ),
  },
   {
    path: "/client/chat/:projectId",
    element: (
      <ProtectedRoute allowedRoles={["client"]}>
        <ChatRoom />
      </ProtectedRoute>
    ),
  },
  // Shared chat route for both clients and freelancers
  {
    path: "/chat/:projectId",
    element: (
      <ProtectedRoute allowedRoles={["client", "freelancer"]}>
        <ChatRoom />
      </ProtectedRoute>
    ),
  },
];
