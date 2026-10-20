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

const getCaseRecords = async (caseId) => {
  const response = await api.get(`/rojnamas/case/${caseId}`);
  return response.data;
};

const getPendingRojnamas = async () => {
  const response = await api.get("/rojnamas/pending");
  return response.data;
};

const sendRemark = async (id, text) => {
  const response = await api.patch(`/rojnamas/${id}/remarks`, { text });
  return response.data;
};

const approveRojnama = async (id) => {
  const response = await api.patch(`/rojnamas/${id}/approve`);
  return response.data;
};

export {
  approveRojnama,
  createRojnama,
  getCaseRecords,
  getPendingRojnamas,
  getRojnama,
  sendRemark,
  submitRojnama,
  updateRojnama,
};
