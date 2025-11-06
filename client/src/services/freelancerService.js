const API_URL = "http://localhost:3000/api/freelancer";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

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

export const getFreelancerProjects = async () => {
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch applications");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getFreelancerApplications:", error);
    throw error;
  }
};



