import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        // ✅ define role from response first
        const role = res.user.role; // "client" or "freelancer"

        // ✅ store role-specific token and user
        localStorage.setItem(`${role}_token`, res.token);
        localStorage.setItem(`${role}_user`, JSON.stringify(res.user));

        // ❌ remove old generic keys to avoid confusion
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // ✅ navigate to correct dashboard
        navigate(`/${role}/dashboard`);
      } else {
        alert(res.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong during login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow-lg rounded-xl"
      >
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 mb-3 w-full rounded"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 mb-3 w-full rounded"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
