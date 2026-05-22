import apiClient from "../../../services/apiClient";

export const getUserProfile = async () => {
  const response = await apiClient.get("/users/me");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await apiClient.put("/users/me", data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await apiClient.post("/users/me/change-password", data);
  return response.data;
};
