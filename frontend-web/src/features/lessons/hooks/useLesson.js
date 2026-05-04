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

  const mutation = useMutation({
    mutationFn: activityService.submitAnswer,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["activity", variables.activityId],
      });
      queryClient.invalidateQueries({ queryKey: ["roadmap"] }); // por si acaso
    },
  });

  // Devuelve una versión asíncrona del mutate
  const submitAnswerAsync = (variables) => mutation.mutateAsync(variables);

  return { ...mutation, submitAnswerAsync };
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
      queryClient.invalidateQueries({ queryKey: ["activity"] }); // Limpia toda la caché de actividades
    },
  });
}
