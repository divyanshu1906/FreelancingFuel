import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "@/services/authService";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(formData);

      if (res.token && res.user) {
        // store generic auth keys: token, role and user
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.user.role);
        localStorage.setItem("user", JSON.stringify(res.user));

        // navigate to shared dashboard home
        navigate("/dashboard/home");
      } else {
        alert(res.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong during login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ff-gradient p-6">
      <div className="max-w-3xl w-full bg-ff-bg rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: Illustration / branding */}
  <div className="hidden md:flex flex-col items-center justify-center bg-linear-to-br from-[#1ea896] to-[#065143] text-white p-8">
          <div className="text-3xl font-bold mb-2">FreelancingFuel</div>
          <p className="text-sm opacity-90 mb-6 text-center">Collaborate, hire & deliver — all in one place.</p>
          <svg className="w-48 h-48 opacity-90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L20 7v6c0 5-3 9-8 9s-8-4-8-9V7l8-5z" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          </svg>
        </div>

        {/* Right: Form */}
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to your account to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs text-gray-600">Email</span>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@company.com"
                  onChange={handleChange}
                    className="block w-full rounded-md border-gray-200 px-3 py-2 ring-ff-accent focus:outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs text-gray-600">Password</span>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Your strong password"
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-200 px-3 py-2 ring-ff-accent focus:outline-none"
                />
              </div>
            </label>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-ff-accent-dark hover:opacity-90 text-white px-4 py-2 rounded-md font-medium transition"
            >
              Sign in
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Don't have an account? <Link to="/register" className="text-ff-accent-dark font-medium">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
