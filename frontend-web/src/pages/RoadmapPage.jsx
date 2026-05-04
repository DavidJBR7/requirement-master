import { useRoadmap } from '../features/lessons/hooks/useLesson';
import RoadmapCard from '../features/lessons/components/RoadmapCard';

export default function RoadmapPage() {
  const { data: lessons, isLoading, error } = useRoadmap();

  if (isLoading) return <p className="text-gray-600">Cargando roadmap...</p>;
  if (error) return <p className="text-red-600">Error al cargar el roadmap.</p>;

  return (
    <section aria-labelledby="roadmap-heading">
      <h2 id="roadmap-heading" className="text-2xl font-bold mb-6">Roadmap</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons
          ?.sort((a, b) => a.orderIndex - b.orderIndex)
          .map(lesson => (
            <RoadmapCard key={lesson.id} lesson={lesson} />
          ))}
      </div>
    </section>
  );
}