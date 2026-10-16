import api from "./api.js";

const createRojnama = async (data) => {
  const response = await api.post("/rojnamas", data);
  return response.data;
};

const updateRojnama = async (id, data) => {
  const response = await api.put(`/rojnamas/${id}`, data);
  return response.data;
};

const submitRojnama = async (id) => {
  const response = await api.patch(`/rojnamas/${id}/submit`);
  return response.data;
};

const getRojnama = async (id) => {
  const response = await api.get(`/rojnamas/${id}`);
  return response.data;
};

export { createRojnama, getRojnama, submitRojnama, updateRojnama };
