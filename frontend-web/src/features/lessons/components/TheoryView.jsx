import { lessonTheoryMap } from "../data/lessonTheory";
import { BookOpen, ArrowRight } from "@phosphor-icons/react";

export default function TheoryView({
  lesson,
  onStartPractice,
  isInModal = false,
}) {
  const theoryContent =
    lessonTheoryMap[lesson.id] ||
    `<p>Contenido teórico no disponible aún para esta lección.</p>`;

  const status = lesson.status == "IN_PROGRESS";
  return (
    <section
      aria-labelledby="theory-heading"
      className="relative flex flex-col min-h-full"
    >
      <article
        className="
        prose prose-gray max-w-none
        prose-headings:text-gray-900
        prose-p:text-gray-700
        prose-strong:text-gray-900
        prose-li:text-gray-700
        prose-code:text-brand-700
        leading-relaxed
        pb-4
        prose-p:text-sm md:prose-p:text-base
        prose-headings:text-base md:prose-headings:text-2xl
        prose-h2:text-lg md:prose-h2:text-xl
      "
        dangerouslySetInnerHTML={{ __html: theoryContent }}
      />
      <footer className="sticky bottom-0 z-30 -mx-1">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-brand-gradient p-3 md:p-5 shadow-xl border border-white/10">
          <div className="relative z-10">
            <div className="flex flex-col flex-row items-center justify-between gap-2 md:gap-5">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <div className="w-8 h-8 md:w-11 md:h-11 shrink-0 rounded-xl md:rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <BookOpen
                    size={20}
                    weight="bold"
                    className="text-white md:w-6 md:h-6"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] md:text-[11px] uppercase tracking-[0.25em] text-blue-200 font-semibold">
                    Clase {lesson.id}
                  </p>

                  <h2
                    id="theory-heading"
                    className="text-xs md:text-2xl font-black text-white leading-tight break-words"
                  >
                    {lesson.title.toUpperCase()}
                  </h2>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 lg:shrink-0">
                {/* Mobile */}{" "}
                <button
                  onClick={onStartPractice}
                  className=" md:hidden w-10 h-10 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors "
                  aria-label={
                    status ? "Continuar práctica" : "Comenzar práctica"
                  }
                >
                  {" "}
                  <ArrowRight
                    size={18}
                    weight="bold"
                    className="text-white"
                  />{" "}
                </button>{" "}
                {/* Desktop */}{" "}
                <button
                  onClick={onStartPractice}
                  className=" hidden md:flex rounded-2xl text-white font-semibold border border-white/20 bg-white/10 hover:border-white px-6 py-2 text-base cursor-pointer transition-colors items-center justify-center "
                >
                  {" "}
                  {status ? "Continuar práctica" : "Comenzar práctica"}{" "}
                </button>{" "}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
