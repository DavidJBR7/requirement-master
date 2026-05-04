import apiClient from "../../../services/apiClient";

export const lessonService = {
  getRoadmap: () => apiClient.get("/lessons/roadmap").then((res) => res.data),
  getLessonDetail: (id) =>
    apiClient.get(`/lessons/${id}`).then((res) => res.data),
};
