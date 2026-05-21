import apiClient from "../../../services/apiClient";

export const dashboardService = {
  getDashboard: () => apiClient.get("/dashboard").then((res) => res.data),
};