import { Link } from "react-router-dom";

const PublicDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <nav className="absolute top-0 right-0 p-6">
        <Link
          to="/login"
          className="text-blue-600 border px-4 py-2 rounded-lg mr-3 hover:bg-blue-600 hover:text-white transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="text-green-600 border px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white transition"
        >
          Register
        </Link>
      </nav>

      <h1 className="text-4xl font-bold mb-4 text-gray-800">
        Welcome to FreelanceHub
      </h1>
      <p className="text-gray-600 max-w-xl text-center">
        Connect clients and freelancers seamlessly. Post projects, apply, and
        collaborate efficiently.
      </p>
    </div>
  );
};

export default PublicDashboard;
