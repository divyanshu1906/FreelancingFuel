const API_URL = "http://localhost:3000/api/auth";

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    // if backend returns an error (e.g., 400 or 500)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to register");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in registerUser:", error);
    return { success: false, message: error.message };
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to login");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in loginUser:", error);
    return { success: false, message: error.message };
  }
};

export const getTokenForRole = (role) =>
  localStorage.getItem(`${role}_token`) || localStorage.getItem("token");

export const clearAuthStorage = () => {
  ["token", "role", "user", "client_token", "freelancer_token", "client_user", "freelancer_user"].forEach((k) => localStorage.removeItem(k));
};

export const logoutUser = async (opts = {}) => {
  const token = opts.token || localStorage.getItem("token");
  try {
    // best-effort call to backend logout endpoint
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  } catch (err) {
    // ignore network errors; we'll still clear local state
    console.error("logoutUser API error:", err);
  }

  // Clear any auth-related storage keys on the client
  clearAuthStorage();

  return { success: true };
};