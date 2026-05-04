import apiClient from "../../../services/apiClient";

export const progressService = {
  finalizeLesson: (lessonId) =>
    apiClient
      .post(`/progress/lessons/${lessonId}/finalize`)
      .then((res) => res.data),
  resetLesson: (lessonId) =>
    apiClient
      .post(`/progress/lessons/${lessonId}/reset`)
      .then((res) => res.data),
};
