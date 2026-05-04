import apiClient from "../../../services/apiClient";

export const activityService = {
  getActivity: (id) =>
    apiClient.get(`/activities/${id}`).then((res) => res.data),
  submitAnswer: (data) =>
    apiClient.post("/activities/answer", data).then((res) => res.data),
};
