import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonService } from "../services/lessonService";
import { activityService } from "../services/activityService";
import { progressService } from "../services/progressService";

// Obtener roadmap
export function useRoadmap() {
  return useQuery({
    queryKey: ["roadmap"],
    queryFn: lessonService.getRoadmap,
    staleTime: 5 * 60 * 1000,
  });
}

// Detalle de lección (teoría + progreso + lista de actividades)
export function useLessonDetail(lessonId) {
  return useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => lessonService.getLessonDetail(lessonId),
    enabled: !!lessonId,
  });
}

// Obtener una actividad concreta (con configuración y progreso)
export function useActivity(activityId) {
  return useQuery({
    queryKey: ["activity", activityId],
    queryFn: () => activityService.getActivity(activityId),
    enabled: !!activityId,
  });
}

// Enviar respuesta de una pregunta
export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activityService.submitAnswer,
    onSuccess: (data, variables) => {
      // Invalidar la actividad actual y el detalle de la lección para refrescar progreso
      queryClient.invalidateQueries({
        queryKey: ["activity", variables.activityId],
      });
      // También invalidamos la lección para que las barras de progreso se actualicen
      // (el frontend no sabe el lessonId en este punto, por eso invalidamos el roadmap y
      // la lección se refrescará al volver a ella; para actualización inmediata usaremos
      // el dato devuelto por el mutate)
    },
  });
}

// Finalizar lección
export function useFinalizeLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: progressService.finalizeLesson,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
      queryClient.invalidateQueries({ queryKey: ["lesson", data.lessonId] });
    },
  });
}

// Reiniciar lección
export function useResetLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: progressService.resetLesson,
    onSuccess: (_, lessonId) => {
      queryClient.invalidateQueries({ queryKey: ["roadmap"] });
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
    },
  });
}
