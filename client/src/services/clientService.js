import { clearAuthStorage } from "@/services/authService";

const API_URL = "http://localhost:3000/api/client";

// Use unified `token` with legacy fallbacks for backward compatibility
const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("client_token") ||
    localStorage.getItem("freelancer_token");

  if (!token) {
    throw new Error("No auth token found (expected 'token' or 'client_token')");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Fetch client summary (automatically detects logged-in client)
export const getClientSummary = async () => {
  try {
    // Prefer unified `user` object, fall back to `client_user` for legacy
    const storedUser = JSON.parse(localStorage.getItem("user") || localStorage.getItem("client_user") || "null");
    if (!storedUser || !storedUser.id) {
      throw new Error("Client user not found in localStorage");
    }

    const response = await fetch(`${API_URL}/summary/${storedUser.id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // token invalid or expired — clear client-side auth so UI can redirect/login
        clearAuthStorage();
        throw new Error("Invalid token");
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch summary");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getClientSummary:", error);
    throw error;
  }
};

// ✅ Fetch all projects for the logged-in client
export const getClientProjects = async () => {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthStorage();
        throw new Error("Invalid token");
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch projects");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getClientProjects:", error);
    throw error;
  }
};

// ✅ Fetch all applications related to the client’s projects
export const getClientApplications = async () => {
  try {
    const response = await fetch(`${API_URL}/applications`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthStorage();
        throw new Error("Invalid token");
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch applications");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getClientApplications:", error);
    throw error;
  }
};
