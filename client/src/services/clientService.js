const API_URL = "http://localhost:3000/api/client";

// ✅ Always use client_token
const getAuthHeaders = () => {
  const token = localStorage.getItem("client_token");
  if (!token) {
    throw new Error("No client token found — please log in again.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Fetch client summary (automatically detects logged-in client)
export const getClientSummary = async () => {
  try {
    const clientUser = JSON.parse(localStorage.getItem("client_user"));
    if (!clientUser || !clientUser.id) {
      throw new Error("Client user not found in localStorage");
    }

    const response = await fetch(`${API_URL}/summary/${clientUser.id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
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
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch applications");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getClientApplications:", error);
    throw error;
  }
};
