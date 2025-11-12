import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logoutUser } from "@/services/authService";

const DashboardLayout = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // update local state so layout re-renders
      setToken(null);
      setRole(null);
      setUser(null);
      // navigate to root
      navigate("/");
    }
  };

  const goHomeForRole = () => {
    if (!role) return navigate("/dashboard");
    if (role === "client") return navigate("/client/dashboard");
    if (role === "freelancer") return navigate("/freelancer/dashboard");
    return navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-[#065143]">FreelancingFuel</Link>

        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <Link to="/login" className="px-3 py-1 border rounded text-[#065143]">Login</Link>
              <Link to="/register" className="px-3 py-1 border rounded text-[#065143]">Register</Link>
            </>
          ) : (
            <>
              {/* Role-aware quick links that point into the existing role dashboards */}
              {role === "client" && (
                <nav className="flex items-center gap-4">
                  <button onClick={goHomeForRole} className="text-sm font-medium text-[#065143]">Home</button>
                </nav>
              )}

              {role === "freelancer" && (
                <nav className="flex items-center gap-4">
                  <button onClick={goHomeForRole} className="text-sm font-medium text-[#065143]">Home</button>
                </nav>
              )}

              <div className="relative">
                <button onClick={() => setProfileOpen((s) => !s)} className="px-3 py-1 border rounded text-sm">View Profile ▾</button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow rounded p-2 z-40">
                    <button onClick={() => { setProfileOpen(false); navigate('/dashboard/profile'); }} className="w-full text-left px-3 py-1 text-sm">View Profile</button>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-1 text-sm text-red-600">Logout</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
