import { useState } from "react";
import { registerUser } from "@/services/authService";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser(formData);
    alert(res.message || "Registered successfully");
    if (res.success) navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ff-gradient p-6">
      <div className="max-w-3xl w-full bg-ff-bg rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex flex-col items-center justify-center bg-ff-gradient text-white p-8">
          <h2 className="text-3xl font-bold mb-2">Join FreelancingFuel</h2>
          <p className="text-sm opacity-90 text-center">Create an account to start collaborating.</p>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create your account</h2>
          <p className="text-sm text-gray-500 mb-6">Sign up as a client or freelancer.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs text-gray-600">Full Name</span>
              <input
                type="text"
                name="name"
                required
                placeholder="Your name"
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-200 px-3 py-2 ring-ff-accent focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-xs text-gray-600">Email</span>
              <input
                type="email"
                name="email"
                required
                placeholder="you@company.com"
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-200 px-3 py-2 ring-ff-accent focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-xs text-gray-600">Password</span>
              <input
                type="password"
                name="password"
                required
                placeholder="Create a password"
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-200 px-3 py-2 ring-ff-accent focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-xs text-gray-600">I am a</span>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-200 px-3 py-2 ring-ff-accent focus:outline-none"
              >
                <option value="freelancer">Freelancer</option>
                <option value="client">Client</option>
              </select>
            </label>

            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-ff-accent-dark hover:opacity-90 text-white px-4 py-2 rounded-md font-medium transition">
              Create account
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-ff-accent-dark font-medium">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
