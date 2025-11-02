const API_URL = "http://localhost:3000/api/projects";

export const getProjects = async () => {
    const res = await fetch(API_URL);
    return res.json();
};

export const createProject = async (projectData) => {
    const res = await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
    });
    return res.json();
};

export const updateProject = async (id, projectData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projectData),
  });
  return res.json();
};


export const deleteProject = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return res.json();
};