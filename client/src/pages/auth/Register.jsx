import { useState } from "react";
import { registerUser } from "@/services/authService";

const Register = () => {
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
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2 mb-3 w-full rounded"
          onChange={handleChange}
        />
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
        <select
          name="role"
          className="border p-2 mb-3 w-full rounded"
          onChange={handleChange}
        >
          <option value="freelancer">Freelancer</option>
          <option value="client">Client</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
