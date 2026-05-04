import Button from '../../../shared/components/Button';

export default function TheoryView({ lesson, onStartPractice, practiceInProgress }) {
  return (
    <section aria-labelledby="theory-heading" className="space-y-6">
      <h2 id="theory-heading" className="text-2xl font-bold">
        {lesson.title}
      </h2>
      <div className="prose max-w-none text-gray-700">
        <p>
          {lesson.description ||
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
        </p>
      </div>
      <Button onClick={onStartPractice} className="w-full sm:w-auto">
        {practiceInProgress ? 'Continuar práctica' : 'Comenzar práctica'}
      </Button>
    </section>
  );
}