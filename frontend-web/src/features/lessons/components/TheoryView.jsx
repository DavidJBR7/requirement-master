import Button from "../../../shared/components/Button";
import { lessonTheoryMap } from "../data/lessonTheory";
import { BookOpen, ArrowRight } from "@phosphor-icons/react";

export default function TheoryView({
  lesson,
  onStartPractice,
  onReset,
  practiceInProgress,
  isInModal = false,
  isResetting = false,
}) {
  const theoryContent =
    lessonTheoryMap[lesson.id] ||
    `<p>Contenido teórico no disponible aún para esta lección.</p>`;

  const isFinalized = lesson.finalized;

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
                {!isFinalized ? (
                  <button
                    onClick={onStartPractice}
                    className="
                                flex items-center justify-center
                                transition-colors
                                border border-white/20
                                bg-white/10
                                hover:bg-white/20
                                hover:border-white
                                text-white font-semibold

                                w-10 h-10 rounded-xl
                                md:w-auto md:h-auto
                                md:px-6 md:py-2
                                md:rounded-2xl

                                cursor-pointer
                              "
                    aria-label={
                      practiceInProgress
                        ? "Continuar práctica"
                        : "Comenzar práctica"
                    }
                  >
                    {/* Mobile */}
                    <span className="md:hidden">
                      <ArrowRight
                        size={18}
                        weight="bold"
                        className="text-white"
                      />
                    </span>

                    {/* Desktop */}
                    <span className="hidden md:block text-base">
                      {practiceInProgress
                        ? "Continuar práctica"
                        : "Comenzar práctica"}
                    </span>
                  </button>
                ) : (
                  onReset && (
                    <button
                      onClick={onReset}
                      isLoading={isResetting}
                      className="
                                rounded-xl md:rounded-2xl
                                w-10 h-10 rounded-xl
                                md:w-auto md:h-auto
                                md:px-6 md:py-2
                                transition-colors
                                border border-white/20
                                bg-white/10
                                hover:bg-white/20
                                hover:border-yellow-400
                                hover:text-yellow-500
                                text-white font-semibold
                                cursor-pointer
                                "
                    >
                      Reiniciar lección
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {isFinalized && (
        <aside className="mt-6 rounded-xl md:rounded-2xl border border-yellow-200 bg-yellow-50 p-3 md:p-4 text-xs md:text-sm text-yellow-800">
          Esta lección ya fue finalizada. Para volver a intentarlo debes
          reiniciarla.
        </aside>
      )}
    </section>
  );
}
