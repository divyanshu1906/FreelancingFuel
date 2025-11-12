const API_URL = "http://localhost:3000/api/freelancer";

const getAuthHeaders = () => {
  // prefer unified token but fall back to legacy role-specific tokens
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("freelancer_token") ||
    localStorage.getItem("client_token");

  if (!token) {
    // let callers decide how to handle missing auth; throw a clear error
    throw new Error("No auth token found (expected 'token' or 'freelancer_token')");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ✅ No ID required in URL
export const getFreelancerSummary = async () => {
  try {
    const response = await fetch(`${API_URL}/summary`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch summary");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getFreelancerSummary:", error);
    throw error;
  }
};

// Optional: other endpoints
export const getFreelancerProjects = async () => {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch projects");
    return await response.json();
  } catch (error) {
    console.error("Error in getFreelancerProjects:", error);
    throw error;
  }
};

export const getFreelancerApplications = async () => {
  try {
    const response = await fetch(`${API_URL}/applications`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch applications");
    return await response.json();
  } catch (error) {
    console.error("Error in getFreelancerApplications:", error);
    throw error;
  }
};
