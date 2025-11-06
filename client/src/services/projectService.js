const API_URL = "http://localhost:3000/api/projects";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getProjects = async () => {
    const res = await fetch(API_URL);
    return res.json();
};

export const getProjectById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch project");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getProjectById:", error);
    throw error;
  }
};

export const getOpenProjects = async () => {
    try {
        const projects = await getProjects();
        // Filter projects with status "open" (excludes "completed" and "in-progress" projects)
        return projects.filter(project => project.status === "open");
    } catch (error) {
        console.error("Error fetching open projects:", error);
        throw error;
    }
};

export const createProject = async (projectData) => {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create project");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in createProject:", error);
    throw error;
  }
};

export const updateProject = async (id, projectData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update project");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in updateProject:", error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete project");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in deleteProject:", error);
    throw error;
  }
};