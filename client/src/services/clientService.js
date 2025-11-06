const API_URL = "http://localhost:3000/api/client";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getClientSummary = async (clientId) => {
  try {
    const response = await fetch(`${API_URL}/summary/${clientId}`, {
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



