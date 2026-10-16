import api from "./api.js";

const getTodaySchedule = async () => {
  const response = await api.get("/hearings/today");
  return response.data;
};

const getStats = async () => {
  const response = await api.get("/hearings/stats");
  return response.data;
};

export { getStats, getTodaySchedule };
