import api from "../../api/axios";

export const getTasks = async () => {
  const resp = await api.get("/tasks/");
  return resp.data;
};

export const createTask = async (payload) => {
  const resp = await api.post("/tasks/", payload);
  return resp.data;
};

export const updateTask = async (id, payload) => {
  const resp = await api.patch(`/tasks/${id}/`, payload);
  return resp.data;
};

export const deleteTask = async (id) => {
  const resp = await api.delete(`/tasks/${id}/`);
  return resp.data;
};
