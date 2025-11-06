const API_URL = "http://localhost:3000/api/applications";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const applyToProject = async (applicationData) => {
  try {
    const response = await fetch(`${API_URL}/apply`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit application");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in applyToProject:", error);
    throw error;
  }
};

export const acceptApplication = async (applicationId) => {
  try {
    const response = await fetch(`${API_URL}/${applicationId}/accept`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to accept application");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in acceptApplication:", error);
    throw error;
  }
};

export const rejectApplication = async (applicationId) => {
  try {
    const response = await fetch(`${API_URL}/${applicationId}/reject`, {
      method: "PUT",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to reject application");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in rejectApplication:", error);
    throw error;
  }
};

