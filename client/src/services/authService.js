import api from "./api.js";

export const loginRequest = async ({ role, roleId, password }) => {
  const response = await api.post("/auth/login", {
    role,
    roleId,
    password,
  });

  return response.data;
};
