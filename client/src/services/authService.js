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
