export const lessonTheoryMap = {
  '1': `
    <div class="space-y-10">

      <!-- HERO -->
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-8 md:p-10 shadow-2xl">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute -top-10 -right-10 w-48 h-48 bg-cyan-400 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-0 w-56 h-56 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div class="relative z-10">

          <h1 class="text-4xl md:text-5xl font-black leading-tight mb-5">
            ¿Qué es un <span class="text-cyan-300">Requerimiento</span>?
          </h1>

          <p class="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl">
            Los requerimientos son la base sobre la que se construye cualquier sistema de software. 
            Antes de programar, diseñar o desplegar una aplicación, primero debemos entender 
            exactamente <strong>qué necesita el usuario</strong> y <strong>qué problema queremos resolver</strong>.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div class="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <div class="text-2xl mb-2">🎯</div>
              <h3 class="font-semibold mb-1">Objetivo</h3>
              <p class="text-sm text-blue-100">
                Comprender qué es un requerimiento y por qué es esencial en software.
              </p>
            </div>

            <div class="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <div class="text-2xl mb-2">🧠</div>
              <h3 class="font-semibold mb-1">Conceptos clave</h3>
              <p class="text-sm text-blue-100">
                Stakeholders, elicitación y especificación de requerimientos.
              </p>
            </div>

            <div class="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur">
              <div class="text-2xl mb-2">🏆</div>
              <h3 class="font-semibold mb-1">Meta</h3>
              <p class="text-sm text-blue-100">
                Alcanzar al menos 70 puntos para desbloquear la siguiente clase.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- OBJETIVOS -->
      <section class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
            🎯
          </div>
          <div>
            <h2 class="text-3xl font-bold text-slate-900">
              Objetivos de la clase
            </h2>
            <p class="text-slate-500">
              Al finalizar esta lección podrás:
            </p>
          </div>
        </div>

        <div class="grid gap-4">
          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">
              Definir con precisión qué es un <strong>requerimiento</strong> en ingeniería de software.
            </p>
          </div>

          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">
              Explicar por qué los requerimientos son críticos para el éxito de un proyecto.
            </p>
          </div>

          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">
              Identificar stakeholders y comprender los procesos iniciales de elicitación y especificación.
            </p>
          </div>
        </div>
      </section>

      <!-- DEFINICIÓN -->
      <section class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl">
            📖
          </div>
          <h2 class="text-3xl font-bold text-slate-900">
            Definición formal de requerimiento
          </h2>
        </div>

        <div class="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-3xl p-8">
          <div class="flex items-start gap-4">
            <div class="text-4xl">💡</div>

            <div>
              <p class="text-lg leading-relaxed text-slate-700">
                Según el estándar <strong>IEEE 29148-2011</strong>, un requerimiento es:
              </p>

              <blockquote class="mt-5 border-l-4 border-indigo-500 pl-5 italic text-slate-800 text-lg leading-relaxed">
                “Una condición o capacidad que debe poseer un sistema para satisfacer un contrato, estándar, especificación u otro documento formalmente impuesto.”
              </blockquote>
            </div>
          </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h3 class="text-2xl font-bold text-slate-900 mb-4">
            Definición práctica
          </h3>

          <p class="text-slate-700 leading-relaxed mb-5">
            Karl Wiegers, uno de los autores más influyentes en ingeniería de requerimientos, 
            describe un requerimiento de una forma más práctica:
          </p>

          <blockquote class="border-l-4 border-cyan-500 pl-5 italic text-slate-800 text-lg leading-relaxed">
            “Un requerimiento es una declaración de una necesidad que un producto debe satisfacer o una condición que debe cumplir.”
          </blockquote>

          <div class="mt-8 rounded-2xl bg-slate-900 text-white p-6 overflow-x-auto">
            <div class="text-cyan-300 text-sm font-semibold mb-3">
              EJEMPLO DE REQUERIMIENTO
            </div>

            <code class="text-sm md:text-base leading-relaxed block">
              “El sistema debe permitir a un usuario registrado iniciar sesión 
              utilizando su correo electrónico y una contraseña de al menos 8 caracteres.”
            </code>
          </div>
        </div>
      </section>

      <!-- IMPORTANCIA -->
      <section class="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
            ⚠️
          </div>

          <h2 class="text-3xl font-bold text-slate-900">
            ¿Por qué son tan importantes?
          </h2>
        </div>

        <p class="text-slate-700 leading-relaxed text-lg mb-6">
          Los requerimientos son la base de todo proyecto de software. 
          Si están mal definidos, el sistema final probablemente no resolverá el problema real del usuario, 
          incluso aunque haya sido desarrollado con excelente tecnología.
        </p>

        <div class="bg-white/80 backdrop-blur border border-amber-100 rounded-2xl p-6">
          <blockquote class="italic text-slate-800 text-lg leading-relaxed">
            “La parte más difícil de construir un sistema de software es decidir exactamente qué construir.”
          </blockquote>

          <p class="mt-4 text-sm text-slate-500">
            — Karl Wiegers, Software Requirements
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-4 mt-8">

          <div class="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
            <div class="text-3xl mb-3">💸</div>
            <h3 class="font-bold text-slate-900 mb-2">
              Sobrecostos
            </h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Corregir errores tarde puede costar hasta 200 veces más.
            </p>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
            <div class="text-3xl mb-3">⏰</div>
            <h3 class="font-bold text-slate-900 mb-2">
              Retrasos
            </h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Los cambios constantes generan retrasos y retrabajo.
            </p>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
            <div class="text-3xl mb-3">❌</div>
            <h3 class="font-bold text-slate-900 mb-2">
              Fracaso del proyecto
            </h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Muchos proyectos fallan por no entender correctamente las necesidades reales.
            </p>
          </div>
        </div>
      </section>

      <!-- ESTADÍSTICAS -->
      <section class="bg-slate-900 text-white rounded-3xl p-8 overflow-hidden relative">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-0 right-0 w-72 h-72 bg-cyan-400 rounded-full blur-3xl"></div>
        </div>

        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-8">
            <div class="text-3xl">📊</div>
            <h2 class="text-3xl font-bold">
              Datos importantes
            </h2>
          </div>

          <div class="grid md:grid-cols-3 gap-5">

            <div class="rounded-2xl bg-white/10 border border-white/10 p-6 backdrop-blur">
              <div class="text-5xl font-black text-cyan-300 mb-3">
                40%–60%
              </div>

              <p class="text-slate-200 leading-relaxed">
                De los defectos encontrados en sistemas provienen de errores en requerimientos.
              </p>
            </div>

            <div class="rounded-2xl bg-white/10 border border-white/10 p-6 backdrop-blur">
              <div class="text-5xl font-black text-amber-300 mb-3">
                50x–200x
              </div>

              <p class="text-slate-200 leading-relaxed">
                Más costoso puede ser corregir errores en producción.
              </p>
            </div>

            <div class="rounded-2xl bg-white/10 border border-white/10 p-6 backdrop-blur">
              <div class="text-5xl font-black text-emerald-300 mb-3">
                29%
              </div>

              <p class="text-slate-200 leading-relaxed">
                De los proyectos son considerados completamente exitosos según CHAOS Report 2015.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CONCEPTOS CLAVE -->
      <section class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">
            🧠
          </div>

          <h2 class="text-3xl font-bold text-slate-900">
            Conceptos clave
          </h2>
        </div>

        <div class="grid gap-6">

          <!-- Stakeholder -->
          <div class="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">
            <div class="flex items-center gap-4 mb-5">
              <div class="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl">
                👥
              </div>

              <div>
                <h3 class="text-2xl font-bold text-slate-900">
                  Stakeholder
                </h3>

                <p class="text-slate-500">
                  Persona u organización interesada en el sistema
                </p>
              </div>
            </div>

            <p class="text-slate-700 leading-relaxed mb-5">
              Un stakeholder es cualquier persona o entidad que tiene interés en el sistema 
              o que puede verse afectada por él.
            </p>

            <div class="grid md:grid-cols-2 gap-4">

              <div class="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                <div class="font-semibold text-slate-900 mb-2">
                  Ejemplos
                </div>

                <ul class="space-y-2 text-slate-700 text-sm">
                  <li>• Usuarios finales</li>
                  <li>• Clientes</li>
                  <li>• Patrocinadores</li>
                  <li>• Equipo de desarrollo</li>
                  <li>• Reguladores</li>
                </ul>
              </div>

              <div class="rounded-2xl bg-blue-50 border border-blue-100 p-5">
                <div class="font-semibold text-slate-900 mb-2">
                  Idea importante
                </div>

                <p class="text-sm text-slate-700 leading-relaxed">
                  Un sistema exitoso debe considerar las necesidades de todos los stakeholders relevantes.
                </p>
              </div>
            </div>
          </div>

          <!-- Elicitación -->
          <div class="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">
            <div class="flex items-center gap-4 mb-5">
              <div class="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl">
                🎤
              </div>

              <div>
                <h3 class="text-2xl font-bold text-slate-900">
                  Elicitación
                </h3>

                <p class="text-slate-500">
                  Descubrir los requerimientos reales
                </p>
              </div>
            </div>

            <p class="text-slate-700 leading-relaxed mb-5">
              La elicitación es el proceso de obtener información de los stakeholders 
              para comprender qué necesita realmente el sistema.
            </p>

            <div class="grid md:grid-cols-4 gap-4">

              <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center">
                <div class="text-3xl mb-2">🗣️</div>
                <div class="font-semibold text-sm">Entrevistas</div>
              </div>

              <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center">
                <div class="text-3xl mb-2">📋</div>
                <div class="font-semibold text-sm">Cuestionarios</div>
              </div>

              <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center">
                <div class="text-3xl mb-2">👀</div>
                <div class="font-semibold text-sm">Observación</div>
              </div>

              <div class="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center">
                <div class="text-3xl mb-2">🤝</div>
                <div class="font-semibold text-sm">Talleres</div>
              </div>
            </div>
          </div>

          <!-- Especificación -->
          <div class="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">
            <div class="flex items-center gap-4 mb-5">
              <div class="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-3xl">
                📄
              </div>

              <div>
                <h3 class="text-2xl font-bold text-slate-900">
                  Especificación de requerimientos
                </h3>

                <p class="text-slate-500">
                  Documento formal del sistema
                </p>
              </div>
            </div>

            <p class="text-slate-700 leading-relaxed">
              Es el documento que describe de forma estructurada y detallada 
              todo lo que el sistema debe hacer, incluyendo funciones, restricciones, 
              reglas y atributos de calidad.
            </p>

            <div class="mt-6 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-5">
              <div class="flex items-center gap-3">
                <div class="text-2xl">📚</div>

                <p class="text-slate-700 leading-relaxed">
                  Históricamente se utilizó el estándar <strong>IEEE 830-1998</strong>; 
                  actualmente fue reemplazado y actualizado por <strong>IEEE 29148</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- EJEMPLO -->
      <section class="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 rounded-3xl p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-2xl">
            🛠️
          </div>

          <h2 class="text-3xl font-bold text-slate-900">
            Ejemplo práctico
          </h2>
        </div>

        <div class="grid md:grid-cols-2 gap-6">

          <div class="bg-white rounded-2xl border border-cyan-100 p-6 shadow-sm">
            <h3 class="font-bold text-xl text-slate-900 mb-4">
              ❌ Mal requerimiento
            </h3>

            <div class="rounded-xl bg-red-50 border border-red-100 p-4 text-slate-700 leading-relaxed">
              “El sistema debe ser bonito y rápido.”
            </div>

            <p class="mt-4 text-sm text-slate-600 leading-relaxed">
              Problema: es ambiguo y no puede verificarse objetivamente.
            </p>
          </div>

          <div class="bg-white rounded-2xl border border-cyan-100 p-6 shadow-sm">
            <h3 class="font-bold text-xl text-slate-900 mb-4">
              ✅ Buen requerimiento
            </h3>

            <div class="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-slate-700 leading-relaxed">
              “El sistema debe cargar la pantalla principal en menos de 2 segundos.”
            </div>

            <p class="mt-4 text-sm text-slate-600 leading-relaxed">
              Ventaja: es específico, claro y verificable.
            </p>
          </div>
        </div>
      </section>

      <!-- RESUMEN -->
      <section class="bg-slate-900 text-white rounded-3xl p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-3xl">📝</div>

          <h2 class="text-3xl font-bold">
            Resumen rápido
          </h2>
        </div>

        <div class="space-y-4">

          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-cyan-300 text-xl">•</div>

            <p class="text-slate-200 leading-relaxed">
              Un requerimiento describe una necesidad o condición que el sistema debe cumplir.
            </p>
          </div>

          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-cyan-300 text-xl">•</div>

            <p class="text-slate-200 leading-relaxed">
              Los errores en requerimientos son una de las principales causas del fracaso de proyectos.
            </p>
          </div>

          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-cyan-300 text-xl">•</div>

            <p class="text-slate-200 leading-relaxed">
              Los stakeholders proporcionan la información necesaria para descubrir los requerimientos.
            </p>
          </div>

          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-cyan-300 text-xl">•</div>

            <p class="text-slate-200 leading-relaxed">
              La elicitación y la especificación son procesos fundamentales en ingeniería de software.
            </p>
          </div>
        </div>
      </section>

      <!-- REFERENCIAS -->
      <section class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-3xl">📚</div>

          <h2 class="text-3xl font-bold text-slate-900">
            Referencias bibliográficas
          </h2>
        </div>

        <div class="space-y-4 text-slate-700 leading-relaxed">

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <strong>Wiegers, Karl E., and Beatty, Joy.</strong> 
            <em>Software Requirements.</em> 3rd ed. Microsoft Press, 2013.
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <strong>Sommerville, Ian.</strong> 
            <em>Software Engineering.</em> 10th ed. Pearson, 2016.
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <strong>Robertson, Suzanne, and Robertson, James.</strong> 
            <em>Mastering the Requirements Process.</em> 3rd ed. Addison-Wesley, 2013.
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <strong>ISO/IEC/IEEE 29148:2011.</strong> 
            Systems and software engineering — Requirements engineering.
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <strong>Standish Group.</strong> 
            CHAOS Report 2015.
          </div>
        </div>
      </section>

    </div>
  `,

  '2': `
    <div class="space-y-10">

      <!-- HERO -->
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 text-white p-8 md:p-10 shadow-2xl">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute -top-10 right-0 w-52 h-52 bg-emerald-400 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 left-10 w-48 h-48 bg-teal-300 rounded-full blur-3xl"></div>
        </div>

        <div class="relative z-10">
          <h1 class="text-4xl md:text-5xl font-black leading-tight mb-5">
            Funcionales vs <span class="text-emerald-300">No Funcionales</span>
          </h1>
          <p class="text-lg md:text-xl text-emerald-100 leading-relaxed max-w-3xl">
            No todos los requerimientos son iguales. Aprende a diferenciar entre lo que el sistema <strong>hace</strong> 
            y las <strong>cualidades</strong> con que lo hace.
          </p>
        </div>
      </section>

      <!-- OBJETIVOS -->
      <section class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">🎯</div>
          <div>
            <h2 class="text-3xl font-bold text-slate-900">Objetivos de la clase</h2>
            <p class="text-slate-500">Al finalizar esta lección podrás:</p>
          </div>
        </div>
        <div class="grid gap-4">
          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">Distinguir entre <strong>requerimientos funcionales</strong> y <strong>no funcionales</strong> con precisión.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">Identificar ejemplos concretos de cada categoría.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">Comprender por qué la clasificación correcta es esencial para una buena especificación.</p>
          </div>
        </div>
      </section>

      <!-- REQUERIMIENTOS FUNCIONALES -->
      <section class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">⚙️</div>
          <h2 class="text-3xl font-bold text-slate-900">Requerimientos funcionales</h2>
        </div>
        <div class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <p class="text-slate-700 leading-relaxed text-lg mb-6">
            Un requerimiento funcional describe <strong>lo que el sistema debe hacer</strong>; una acción, un cálculo, 
            un flujo de datos o una interacción con el usuario.
          </p>
          <blockquote class="border-l-4 border-emerald-500 pl-5 italic text-slate-800 text-lg leading-relaxed mb-6">
            “Un requerimiento funcional especifica un comportamiento que el sistema debe exhibir bajo ciertas condiciones.”
            <p class="text-sm text-slate-500 mt-2">— Wiegers & Beatty, Software Requirements, 3.ª ed.</p>
          </blockquote>

          <h3 class="text-xl font-bold text-slate-900 mb-4">Ejemplos típicos</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-slate-50 rounded-2xl border border-slate-200 p-5">
              <code class="text-slate-700">“El sistema debe permitir al usuario registrarse con correo y contraseña.”</code>
            </div>
            <div class="bg-slate-50 rounded-2xl border border-slate-200 p-5">
              <code class="text-slate-700">“El sistema debe emitir un comprobante de pago en formato PDF.”</code>
            </div>
            <div class="bg-slate-50 rounded-2xl border border-slate-200 p-5">
              <code class="text-slate-700">“El sistema debe enviar un correo de confirmación al finalizar la reserva.”</code>
            </div>
            <div class="bg-slate-50 rounded-2xl border border-slate-200 p-5">
              <code class="text-slate-700">“El sistema debe calcular el total de la factura aplicando el IVA.”</code>
            </div>
          </div>
          <p class="text-sm text-slate-500 mt-4">Se expresan con verbos de acción: registrar, calcular, enviar, mostrar.</p>
        </div>
      </section>

      <!-- REQUERIMIENTOS NO FUNCIONALES -->
      <section class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl">🌟</div>
          <h2 class="text-3xl font-bold text-slate-900">Requerimientos no funcionales</h2>
        </div>
        <div class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <p class="text-slate-700 leading-relaxed text-lg mb-6">
            Un requerimiento no funcional describe <strong>cómo debe ser el sistema</strong>; las cualidades que 
            debe exhibir en su operación, desarrollo o relación con el entorno.
          </p>
          <blockquote class="border-l-4 border-purple-500 pl-5 italic text-slate-800 text-lg leading-relaxed mb-6">
            “Restricciones sobre los servicios o funciones ofrecidos por el sistema. Incluyen limitaciones de tiempo, 
            restricciones sobre el proceso de desarrollo y restricciones impuestas por estándares.”
            <p class="text-sm text-slate-500 mt-2">— Sommerville, Software Engineering, 10.ª ed.</p>
          </blockquote>

          <h3 class="text-xl font-bold text-slate-900 mb-4">Categorías principales (ISO/IEC 25010)</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full border border-slate-200 rounded-2xl overflow-hidden">
              <thead>
                <tr class="bg-slate-100">
                  <th class="px-4 py-3 text-left font-semibold text-slate-700">Categoría</th>
                  <th class="px-4 py-3 text-left font-semibold text-slate-700">Descripción</th>
                  <th class="px-4 py-3 text-left font-semibold text-slate-700">Ejemplo</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr><td class="px-4 py-3 font-medium">Rendimiento</td><td class="px-4 py-3 text-slate-600">Tiempos de respuesta, capacidad</td><td class="px-4 py-3 text-sm">“Búsqueda en <2 seg para 95% consultas”</td></tr>
                <tr class="bg-slate-50"><td class="px-4 py-3 font-medium">Disponibilidad</td><td class="px-4 py-3 text-slate-600">Tiempo operativo</td><td class="px-4 py-3 text-sm">“Disponibilidad del 99.9% en horario laboral”</td></tr>
                <tr><td class="px-4 py-3 font-medium">Seguridad</td><td class="px-4 py-3 text-slate-600">Confidencialidad, control de acceso</td><td class="px-4 py-3 text-sm">“Datos cifrados con TLS 1.3”</td></tr>
                <tr class="bg-slate-50"><td class="px-4 py-3 font-medium">Usabilidad</td><td class="px-4 py-3 text-slate-600">Facilidad de aprendizaje</td><td class="px-4 py-3 text-sm">“Primera compra sin ayuda en <5 min”</td></tr>
                <tr><td class="px-4 py-3 font-medium">Mantenibilidad</td><td class="px-4 py-3 text-slate-600">Facilidad de cambio</td><td class="px-4 py-3 text-sm">“Cobertura de pruebas unitarias >80%”</td></tr>
                <tr class="bg-slate-50"><td class="px-4 py-3 font-medium">Portabilidad</td><td class="px-4 py-3 text-slate-600">Migrar a otro entorno</td><td class="px-4 py-3 text-sm">“Funciona en Chrome, Firefox, Edge”</td></tr>
                <tr><td class="px-4 py-3 font-medium">Fiabilidad</td><td class="px-4 py-3 text-slate-600">Operar sin fallos</td><td class="px-4 py-3 text-sm">“No perder >1 transacción de 100000”</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- IMPORTANCIA DE CLASIFICAR -->
      <section class="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 rounded-3xl p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-2xl">🔍</div>
          <h2 class="text-3xl font-bold text-slate-900">¿Por qué es importante clasificar?</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl border border-cyan-100 p-6">
            <div class="text-3xl mb-3">🚫</div>
            <p class="text-slate-700 leading-relaxed">No omitir restricciones críticas: un sistema puede cumplir todas las funciones pero ser inutilizable si tarda 20 segundos en responder.</p>
          </div>
          <div class="bg-white rounded-2xl border border-cyan-100 p-6">
            <div class="text-3xl mb-3">🧪</div>
            <p class="text-slate-700 leading-relaxed">Planificar pruebas: los funcionales se prueban con casos de uso, los no funcionales requieren pruebas de carga, estrés, penetración, etc.</p>
          </div>
          <div class="bg-white rounded-2xl border border-cyan-100 p-6">
            <div class="text-3xl mb-3">📋</div>
            <p class="text-slate-700 leading-relaxed">Priorizar: en muchos proyectos se tiende a sobredimensionar las funciones y olvidar las cualidades, provocando insatisfacción.</p>
          </div>
        </div>
      </section>

      <!-- CASOS FRONTERA -->
      <section class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-2xl">⚠️</div>
          <h2 class="text-3xl font-bold text-slate-900">Casos en la frontera</h2>
        </div>
        <p class="text-slate-700 leading-relaxed mb-6">
          Algunos enunciados pueden ser ambiguos. Por ejemplo: <em>“El sistema debe ser fácil de mantener”</em> es claramente no funcional (mantenibilidad). 
          Pero si se detalla: <em>“El sistema debe permitir que un administrador cambie el porcentaje de IVA sin desplegar una nueva versión”</em>, 
          se convierte en una función específica que satisface el atributo no funcional.
        </p>
        <div class="rounded-2xl bg-amber-50 border border-amber-200 p-5">
          <p class="text-slate-700 leading-relaxed">
            <strong>Consejo:</strong> La exigencia original es no funcional; la solución concreta se convierte en un requerimiento funcional. 
            Esta distinción se practicará en el diagrama de Venn interactivo.
          </p>
        </div>
      </section>

      <!-- RESUMEN -->
      <section class="bg-slate-900 text-white rounded-3xl p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-3xl">📝</div>
          <h2 class="text-3xl font-bold">Resumen rápido</h2>
        </div>
        <div class="space-y-4">
          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-emerald-300 text-xl">•</div>
            <p class="text-slate-200 leading-relaxed"><strong>Funcional:</strong> lo que el sistema hace (acciones, cálculos).</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-emerald-300 text-xl">•</div>
            <p class="text-slate-200 leading-relaxed"><strong>No funcional:</strong> cualidades y restricciones (rendimiento, seguridad, usabilidad).</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-emerald-300 text-xl">•</div>
            <p class="text-slate-200 leading-relaxed">Clasificar correctamente permite no olvidar restricciones y planificar las pruebas adecuadas.</p>
          </div>
        </div>
      </section>

      <!-- REFERENCIAS -->
      <section class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-3xl">📚</div>
          <h2 class="text-3xl font-bold text-slate-900">Referencias bibliográficas</h2>
        </div>
        <div class="space-y-4 text-slate-700 leading-relaxed">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>Wiegers, K. E. & Beatty, J.</strong> <em>Software Requirements</em>. 3.ª ed. Microsoft Press, 2013.</div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>Sommerville, I.</strong> <em>Software Engineering</em>. 10.ª ed. Pearson, 2016.</div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>ISO/IEC 25010:2011.</strong> System and software quality models.</div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>Robertson, S. & Robertson, J.</strong> <em>Mastering the Requirements Process</em>. 3.ª ed. Addison-Wesley, 2013.</div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>ISO/IEC/IEEE 29148:2018.</strong> Requirements engineering.</div>
        </div>
      </section>

    </div>
  `,

  '3': `
    <div class="space-y-10">

      <!-- HERO -->
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 text-white p-8 md:p-10 shadow-2xl">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-10 left-10 w-56 h-56 bg-amber-400 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 right-10 w-64 h-64 bg-orange-500 rounded-full blur-3xl"></div>
        </div>
        <div class="relative z-10">
          <h1 class="text-4xl md:text-5xl font-black leading-tight mb-5">
            Entrevistas y <span class="text-amber-300">Cuestionarios</span>
          </h1>
          <p class="text-lg md:text-xl text-amber-100 leading-relaxed max-w-3xl">
            Aprende las técnicas fundamentales para obtener información directamente de los stakeholders 
            y descubrir los requerimientos reales.
          </p>
        </div>
      </section>

      <!-- OBJETIVOS -->
      <section class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">🎯</div>
          <div>
            <h2 class="text-3xl font-bold text-slate-900">Objetivos de la clase</h2>
            <p class="text-slate-500">Al finalizar esta lección podrás:</p>
          </div>
        </div>
        <div class="grid gap-4">
          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">Comprender la importancia de la <strong>entrevista</strong> como técnica de elicitación.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">Distinguir y formular <strong>preguntas abiertas, cerradas, de sondeo</strong> y evitar sesgos.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">Planificar y conducir una entrevista de elicitación básica.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">Reconocer en qué situaciones conviene utilizar <strong>cuestionarios</strong>.</p>
          </div>
        </div>
      </section>

      <!-- LA ENTREVISTA -->
      <section class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">🎤</div>
          <h2 class="text-3xl font-bold text-slate-900">La entrevista como técnica de elicitación</h2>
        </div>
        <div class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <p class="text-slate-700 leading-relaxed text-lg mb-6">
            La entrevista es la técnica más utilizada para obtener requerimientos. Wiegers & Beatty la definen como:
          </p>
          <blockquote class="border-l-4 border-amber-500 pl-5 italic text-slate-800 text-lg leading-relaxed mb-6">
            “Una conversación estructurada con un stakeholder cuyo propósito es descubrir necesidades, expectativas y restricciones del sistema a construir.”
          </blockquote>
          <p class="text-slate-700 leading-relaxed">
            Permiten profundizar en las razones detrás de una petición, observar el lenguaje no verbal (cuando son presenciales) 
            y adaptar las preguntas según la conversación.
          </p>
        </div>
      </section>

      <!-- TIPOS DE ENTREVISTA -->
      <section class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <span class="text-3xl">📋</span> Tipos de entrevista
        </h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="bg-slate-50 rounded-2xl border border-slate-200 p-6">
            <div class="text-2xl mb-3">🗂️</div>
            <h3 class="font-bold text-lg text-slate-900 mb-2">Estructurada</h3>
            <p class="text-sm text-slate-600">Guión rígido de preguntas. Útil para información homogénea de muchos entrevistados.</p>
          </div>
          <div class="bg-slate-50 rounded-2xl border border-slate-200 p-6">
            <div class="text-2xl mb-3">💬</div>
            <h3 class="font-bold text-lg text-slate-900 mb-2">No estructurada</h3>
            <p class="text-sm text-slate-600">Conversación libre. Permite descubrir necesidades inesperadas, pero es más difícil de analizar.</p>
          </div>
          <div class="bg-slate-50 rounded-2xl border border-slate-200 p-6">
            <div class="text-2xl mb-3">⭐</div>
            <h3 class="font-bold text-lg text-slate-900 mb-2">Semiestructurada</h3>
            <p class="text-sm text-slate-600">Combina preguntas base con libertad para explorar. Es la forma más recomendada en ingeniería de requisitos.</p>
          </div>
        </div>
      </section>

      <!-- TIPOS DE PREGUNTAS -->
      <section class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl">❓</div>
          <h2 class="text-3xl font-bold text-slate-900">Tipos de preguntas</h2>
        </div>
        <div class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <p class="text-slate-700 leading-relaxed mb-6">Conocer el efecto de cada tipo de pregunta es esencial para dirigir la entrevista.</p>
          <div class="overflow-x-auto">
            <table class="min-w-full border border-slate-200 rounded-2xl overflow-hidden">
              <thead>
                <tr class="bg-slate-100">
                  <th class="px-4 py-3 text-left font-semibold">Tipo</th>
                  <th class="px-4 py-3 text-left font-semibold">Propósito</th>
                  <th class="px-4 py-3 text-left font-semibold">Ejemplo</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr><td class="px-4 py-3 font-medium">Abierta</td><td class="px-4 py-3 text-slate-600">Animar al entrevistado a compartir información amplia.</td><td class="px-4 py-3 text-sm">"¿Cómo describiría un día típico en su área?"</td></tr>
                <tr class="bg-slate-50"><td class="px-4 py-3 font-medium">Cerrada</td><td class="px-4 py-3 text-slate-600">Confirmar un dato puntual o limitar respuestas.</td><td class="px-4 py-3 text-sm">"¿Actualmente utilizan algún software para esta tarea?"</td></tr>
                <tr><td class="px-4 py-3 font-medium">De sondeo</td><td class="px-4 py-3 text-slate-600">Profundizar en una respuesta anterior.</td><td class="px-4 py-3 text-sm">"Ha dicho que es lento, ¿podría darme un ejemplo?"</td></tr>
                <tr class="bg-slate-50"><td class="px-4 py-3 font-medium text-red-600">Sesgada</td><td class="px-4 py-3 text-slate-600">Induce hacia una respuesta concreta. <strong>Se debe evitar.</strong></td><td class="px-4 py-3 text-sm">"¿No le parece que un botón rojo sería más visible?"</td></tr>
              </tbody>
            </table>
          </div>
          <p class="mt-6 text-sm text-slate-500">Una buena entrevista comienza con preguntas abiertas, luego usa cerradas para confirmar y de sondeo para aclarar.</p>
        </div>
      </section>

      <!-- PREPARACIÓN DE UNA ENTREVISTA -->
      <section class="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-3xl p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">📝</div>
          <h2 class="text-3xl font-bold text-slate-900">Preparación de una entrevista</h2>
        </div>
        <p class="text-slate-700 leading-relaxed mb-6">Sommerville y Robertson & Robertson coinciden en estos pasos:</p>
        <div class="space-y-4">
          <div class="flex gap-4 p-5 rounded-2xl bg-white border border-amber-100">
            <div class="text-2xl font-bold text-amber-500">1</div>
            <p class="text-slate-700"><strong>Definir el objetivo</strong> — ¿Qué información concreta necesito obtener?</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-white border border-amber-100">
            <div class="text-2xl font-bold text-amber-500">2</div>
            <p class="text-slate-700"><strong>Identificar al stakeholder adecuado</strong> — La persona que conoce el dominio y tiene autoridad.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-white border border-amber-100">
            <div class="text-2xl font-bold text-amber-500">3</div>
            <p class="text-slate-700"><strong>Elaborar la guía de preguntas</strong> — Abiertas, cerradas y de sondeo, evitando sesgos.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-white border border-amber-100">
            <div class="text-2xl font-bold text-amber-500">4</div>
            <p class="text-slate-700"><strong>Concertar la cita y comunicar el propósito</strong> — Duración y motivo de la entrevista.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-white border border-amber-100">
            <div class="text-2xl font-bold text-amber-500">5</div>
            <p class="text-slate-700"><strong>Documentar inmediatamente después</strong> — Notas en limpio, validadas con el entrevistado.</p>
          </div>
        </div>
      </section>

      <!-- CUESTIONARIOS -->
      <section class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-3xl">📋</div>
          <h2 class="text-3xl font-bold text-slate-900">Cuestionarios</h2>
        </div>
        <p class="text-slate-700 leading-relaxed mb-6">Cuando se necesita información de muchos stakeholders dispersos, los cuestionarios son un complemento útil. Para que sean efectivos deben:</p>
        <ul class="space-y-3 text-slate-700">
          <li class="flex gap-3"><span class="text-emerald-500">✔</span> Ser cortos y con lenguaje claro.</li>
          <li class="flex gap-3"><span class="text-emerald-500">✔</span> Evitar preguntas compuestas ("¿El sistema es rápido y fácil de usar?").</li>
          <li class="flex gap-3"><span class="text-emerald-500">✔</span> Incluir una mezcla de preguntas abiertas y cerradas.</li>
          <li class="flex gap-3"><span class="text-emerald-500">✔</span> Ser probados (piloto) con un grupo pequeño antes de la distribución masiva.</li>
        </ul>
      </section>

      <!-- RESUMEN -->
      <section class="bg-slate-900 text-white rounded-3xl p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-3xl">📝</div>
          <h2 class="text-3xl font-bold">Resumen rápido</h2>
        </div>
        <div class="space-y-4">
          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-amber-300 text-xl">•</div>
            <p class="text-slate-200 leading-relaxed">La entrevista es la técnica más común de elicitación; puede ser estructurada, no estructurada o semiestructurada.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-amber-300 text-xl">•</div>
            <p class="text-slate-200 leading-relaxed">Usa preguntas abiertas para explorar, cerradas para confirmar, de sondeo para profundizar y evita las sesgadas.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-amber-300 text-xl">•</div>
            <p class="text-slate-200 leading-relaxed">Preparar la entrevista es clave: define objetivo, identifica al stakeholder, elabora guía, concreta la cita y documenta.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-amber-300 text-xl">•</div>
            <p class="text-slate-200 leading-relaxed">Los cuestionarios son útiles para recolectar datos de muchos stakeholders, pero deben ser breves y probados.</p>
          </div>
        </div>
      </section>

      <!-- REFERENCIAS -->
      <section class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-3xl">📚</div>
          <h2 class="text-3xl font-bold text-slate-900">Referencias bibliográficas</h2>
        </div>
        <div class="space-y-4 text-slate-700 leading-relaxed">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>Wiegers, K. E. & Beatty, J.</strong> <em>Software Requirements</em>. 3.ª ed. Microsoft Press, 2013. Cap. 5.</div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>Sommerville, I.</strong> <em>Software Engineering</em>. 10.ª ed. Pearson, 2016. Sección 4.4.</div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>Robertson, S. & Robertson, J.</strong> <em>Mastering the Requirements Process</em>. 3.ª ed. Addison-Wesley, 2013. Cap. 4.</div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>Pohl, K.</strong> <em>Requirements Engineering</em>. Springer, 2010. Cap. 7.</div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>ISO/IEC/IEEE 29148:2018.</strong> Actividades de elicitación.</div>
        </div>
      </section>

    </div>
  `,

  '4': `
    <div class="space-y-10">

      <!-- HERO -->
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-900 via-purple-800 to-indigo-900 text-white p-8 md:p-10 shadow-2xl">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-5 right-10 w-52 h-52 bg-pink-400 rounded-full blur-3xl"></div>
          <div class="absolute bottom-5 left-5 w-48 h-48 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        <div class="relative z-10">
          <h1 class="text-4xl md:text-5xl font-black leading-tight mb-5">
            User Stories y <span class="text-pink-300">Criterios de Aceptación</span>
          </h1>
          <p class="text-lg md:text-xl text-purple-100 leading-relaxed max-w-3xl">
            Descubre el formato ágil para capturar requisitos y cómo los criterios de aceptación garantizan 
            que cada historia sea comprobable y valiosa.
          </p>
        </div>
      </section>

      <!-- OBJETIVOS -->
      <section class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl">🎯</div>
          <div>
            <h2 class="text-3xl font-bold text-slate-900">Objetivos de la clase</h2>
            <p class="text-slate-500">Al finalizar esta lección podrás:</p>
          </div>
        </div>
        <div class="grid gap-4">
          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">Redactar una user story con <strong>rol, funcionalidad y beneficio</strong>.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">Identificar cuándo una user story está bien o mal formulada.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">Reconocer la importancia de los <strong>criterios de aceptación</strong> y redactarlos.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">Entender los principios básicos para describir requisitos en entornos ágiles.</p>
          </div>
        </div>
      </section>

      <!-- ORIGEN Y PROPÓSITO -->
      <section class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center text-2xl">📖</div>
          <h2 class="text-3xl font-bold text-slate-900">Origen y propósito de las user stories</h2>
        </div>
        <div class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <p class="text-slate-700 leading-relaxed mb-6">
            Las user stories provienen del Extreme Programming (XP) y se popularizaron con Scrum. Mike Cohn, en su libro <em>User Stories Applied</em>, las define así:
          </p>
          <blockquote class="border-l-4 border-pink-500 pl-5 italic text-slate-800 text-lg leading-relaxed mb-6">
            “Una user story es una descripción corta de una funcionalidad contada desde la perspectiva de la persona que la desea. 
            Su propósito es capturar el ‘qué’ y el ‘para qué’, no el ‘cómo’.”
          </blockquote>
          <p class="text-slate-700 leading-relaxed">
            Sustituyen a los largos documentos de requisitos por un formato ligero, que fomenta la conversación continua. 
            No contienen todos los detalles, sino que son un recordatorio que se amplía con discusiones y criterios de aceptación.
          </p>
        </div>
      </section>

      <!-- FORMATO ESTÁNDAR -->
      <section class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-3xl">✏️</div>
          <h2 class="text-3xl font-bold text-slate-900">Formato estándar</h2>
        </div>
        <div class="rounded-2xl bg-slate-900 text-white p-6 mb-6">
          <code class="text-lg md:text-xl">Como <span class="text-pink-300">[tipo de usuario o rol]</span><br/>
          quiero <span class="text-pink-300">[alguna función o capacidad]</span><br/>
          para <span class="text-pink-300">[objetivo o beneficio]</span>.</code>
        </div>
        <p class="text-slate-700 leading-relaxed mb-4">Ejemplo:</p>
        <div class="bg-purple-50 border border-purple-100 rounded-2xl p-5">
          <p class="text-slate-800"><em>Como cliente registrado, quiero ver el historial de mis pedidos para controlar mis gastos.</em></p>
        </div>
        <p class="text-sm text-slate-500 mt-4">Este formato mantiene el foco en el usuario real, evita soluciones técnicas prematuras y explica el valor de negocio.</p>
      </section>

      <!-- INVEST -->
      <section class="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl">⭐</div>
          <h2 class="text-3xl font-bold text-slate-900">Características de una buena user story (INVEST)</h2>
        </div>
        <p class="text-slate-700 leading-relaxed mb-6">Bill Wake, retomado por Mike Cohn, propuso el acrónimo INVEST para evaluar la calidad de una user story:</p>
        <div class="overflow-x-auto">
          <table class="min-w-full border border-indigo-100 rounded-2xl overflow-hidden">
            <thead>
              <tr class="bg-white">
                <th class="px-4 py-3 text-left font-semibold">Letra</th>
                <th class="px-4 py-3 text-left font-semibold">Significado</th>
                <th class="px-4 py-3 text-left font-semibold">Explicación</th>
              </tr>
            </thead>
            <tbody class="bg-white/80">
              <tr><td class="px-4 py-3 font-bold">I</td><td class="px-4 py-3 font-medium">Independent</td><td class="px-4 py-3 text-slate-600">Lo más independiente posible para facilitar la priorización.</td></tr>
              <tr><td class="px-4 py-3 font-bold">N</td><td class="px-4 py-3 font-medium">Negotiable</td><td class="px-4 py-3 text-slate-600">El detalle no está grabado en piedra; se negocia durante el desarrollo.</td></tr>
              <tr><td class="px-4 py-3 font-bold">V</td><td class="px-4 py-3 font-medium">Valuable</td><td class="px-4 py-3 text-slate-600">Debe entregar valor perceptible al usuario o al negocio.</td></tr>
              <tr><td class="px-4 py-3 font-bold">E</td><td class="px-4 py-3 font-medium">Estimable</td><td class="px-4 py-3 text-slate-600">El equipo debe ser capaz de estimar el esfuerzo relativo.</td></tr>
              <tr><td class="px-4 py-3 font-bold">S</td><td class="px-4 py-3 font-medium">Small</td><td class="px-4 py-3 text-slate-600">Suficientemente pequeña para caber en una iteración (Sprint).</td></tr>
              <tr><td class="px-4 py-3 font-bold">T</td><td class="px-4 py-3 font-medium">Testable</td><td class="px-4 py-3 text-slate-600">Debe existir una forma clara de verificar que se ha cumplido (criterios de aceptación).</td></tr>
            </tbody>
          </table>
        </div>
        <p class="mt-4 text-sm text-slate-500">Ejemplo: una historia como “Hacer que la aplicación sea rápida” falla en Specific (no lo es), no se puede estimar ni probar directamente.</p>
      </section>

      <!-- CRITERIOS DE ACEPTACIÓN -->
      <section class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-3xl">✅</div>
          <h2 class="text-3xl font-bold text-slate-900">Criterios de aceptación</h2>
        </div>
        <p class="text-slate-700 leading-relaxed mb-6">
          Son condiciones que debe satisfacer la historia para considerarse completada. Definen los límites de la funcionalidad 
          y son la base de las pruebas funcionales.
        </p>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold text-slate-900 mb-3">Características</h3>
            <ul class="space-y-2 text-slate-700">
              <li>• Concretos, no ambiguos.</li>
              <li>• Lenguaje cercano al usuario.</li>
              <li>• Pueden incluir escenarios (dado, cuando, entonces).</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-slate-900 mb-3">Ejemplo para la historia anterior</h3>
            <ul class="space-y-2 text-sm text-slate-700">
              <li>• El historial debe mostrar los últimos 100 pedidos ordenados del más reciente al más antiguo.</li>
              <li>• Cada pedido debe mostrar fecha, número de pedido y total.</li>
              <li>• Si el cliente no ha realizado ningún pedido, debe mostrarse un mensaje informativo.</li>
              <li>• La página debe cargar en menos de 2 segundos.</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- DIVISIÓN DE ÉPICAS -->
      <section class="bg-amber-50 border border-amber-200 rounded-3xl p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">🧩</div>
          <h2 class="text-3xl font-bold text-slate-900">División de épicas (epics)</h2>
        </div>
        <p class="text-slate-700 leading-relaxed mb-6">
          Una épica es una user story demasiado grande para una sola iteración. Por ejemplo: <em>“Como cliente quiero gestionar mi perfil”</em>.
        </p>
        <p class="text-slate-700 leading-relaxed mb-6">Para dividir una épica se pueden aplicar estos patrones:</p>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white rounded-2xl border border-amber-100 p-5">
            <strong>Por operaciones CRUD</strong><br/>
            <span class="text-sm text-slate-600">Crear, Leer, Actualizar, Eliminar se convierten en historias separadas.</span>
          </div>
          <div class="bg-white rounded-2xl border border-amber-100 p-5">
            <strong>Por flujos de usuario</strong><br/>
            <span class="text-sm text-slate-600">Cada paso del flujo se convierte en una historia.</span>
          </div>
          <div class="bg-white rounded-2xl border border-amber-100 p-5">
            <strong>Por reglas de negocio</strong><br/>
            <span class="text-sm text-slate-600">Cada regla o caso particular es una historia.</span>
          </div>
          <div class="bg-white rounded-2xl border border-amber-100 p-5">
            <strong>Por plataforma</strong><br/>
            <span class="text-sm text-slate-600">Web y móvil pueden ser historias separadas si el esfuerzo lo justifica.</span>
          </div>
        </div>
        <p class="mt-4 text-sm text-slate-600">Una buena división mantiene cada historia como un incremento de valor, no como una tarea técnica.</p>
      </section>

      <!-- RESUMEN -->
      <section class="bg-slate-900 text-white rounded-3xl p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-3xl">📝</div>
          <h2 class="text-3xl font-bold">Resumen rápido</h2>
        </div>
        <div class="space-y-4">
          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-pink-300 text-xl">•</div>
            <p class="text-slate-200 leading-relaxed">Formato: <strong>Como</strong> rol, <strong>quiero</strong> función, <strong>para</strong> beneficio.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-pink-300 text-xl">•</div>
            <p class="text-slate-200 leading-relaxed">INVEST ayuda a evaluar la calidad: Independiente, Negociable, Valiosa, Estimable, Pequeña, Testable.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-pink-300 text-xl">•</div>
            <p class="text-slate-200 leading-relaxed">Los criterios de aceptación convierten la historia en algo verificable y delimitan su alcance.</p>
          </div>
        </div>
      </section>

      <!-- REFERENCIAS -->
      <section class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-3xl">📚</div>
          <h2 class="text-3xl font-bold text-slate-900">Referencias bibliográficas</h2>
        </div>
        <div class="space-y-4 text-slate-700 leading-relaxed">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>Cohn, M.</strong> <em>User Stories Applied</em>. Addison-Wesley, 2004.</div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>Cohn, M.</strong> <em>Agile Estimating and Planning</em>. Prentice Hall, 2006.</div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>Schwaber, K. & Sutherland, J.</strong> <em>The Scrum Guide™</em>. 2020.</div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>Wake, B.</strong> “INVEST in Good Stories”. XP123.com, 2003.</div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>Beck, K.</strong> <em>Extreme Programming Explained</em>. 2.ª ed. Addison-Wesley, 2005.</div>
        </div>
      </section>

    </div>
  `,

  '5': `
    <div class="space-y-10">

      <!-- HERO -->
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900 text-white p-8 md:p-10 shadow-2xl">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-10 left-10 w-56 h-56 bg-blue-400 rounded-full blur-3xl"></div>
          <div class="absolute bottom-0 right-10 w-60 h-60 bg-cyan-400 rounded-full blur-3xl"></div>
        </div>
        <div class="relative z-10">
          <h1 class="text-4xl md:text-5xl font-black leading-tight mb-5">
            Validación de Requerimientos <span class="text-cyan-300">(SMART)</span>
          </h1>
          <p class="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl">
            Asegurar que los requerimientos sean correctos, completos y verificables antes de construir 
            evita los errores más costosos del proyecto.
          </p>
        </div>
      </section>

      <!-- OBJETIVOS -->
      <section class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-2xl">🎯</div>
          <div>
            <h2 class="text-3xl font-bold text-slate-900">Objetivos de la clase</h2>
            <p class="text-slate-500">Al finalizar esta lección podrás:</p>
          </div>
        </div>
        <div class="grid gap-4">
          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">Diferenciar entre <strong>validación</strong> y <strong>verificación</strong> de requerimientos.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">Evaluar un requerimiento aplicando los criterios <strong>SMART</strong>.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">Identificar y corregir defectos: ambigüedad, incompletitud, contradicción, inviabilidad.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="text-2xl">✅</div>
            <p class="text-slate-700 leading-relaxed">Reconocer las técnicas básicas de validación de requisitos.</p>
          </div>
        </div>
      </section>

      <!-- QUÉ ES VALIDAR -->
      <section class="space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">🔍</div>
          <h2 class="text-3xl font-bold text-slate-900">¿Qué es validar requerimientos?</h2>
        </div>
        <div class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <p class="text-slate-700 leading-relaxed mb-6">
            La validación de requerimientos consiste en comprobar que los requerimientos definidos describen exactamente lo que los 
            interesados necesitan, sin defectos que puedan generar ambigüedades, omisiones o conflictos en etapas posteriores.
          </p>
          <blockquote class="border-l-4 border-blue-500 pl-5 italic text-slate-800 text-lg leading-relaxed mb-6">
            “La validación de requisitos examina la especificación para asegurar que todos los requisitos del sistema han sido declarados 
            sin ambigüedad, que las inconsistencias, omisiones y errores han sido detectados y corregidos.”
            <p class="text-sm text-slate-500 mt-2">— Wiegers & Beatty, Software Requirements, 3.ª ed.</p>
          </blockquote>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-blue-50 rounded-2xl border border-blue-100 p-5">
              <strong class="text-blue-800">Validación:</strong> asegurar que el conjunto de requerimientos satisface las necesidades de los stakeholders (construir el producto correcto).
            </div>
            <div class="bg-emerald-50 rounded-2xl border border-emerald-100 p-5">
              <strong class="text-emerald-800">Verificación:</strong> asegurar que los artefactos cumplen reglas, estándares y convenciones (construir correctamente el producto).
            </div>
          </div>
          <p class="text-sm text-slate-500 mt-4">Fuente: IEEE 29148:2018.</p>
        </div>
      </section>

      <!-- CRITERIOS SMART -->
      <section class="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100 rounded-3xl p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-2xl">🧪</div>
          <h2 class="text-3xl font-bold text-slate-900">Criterios SMART para requerimientos</h2>
        </div>
        <p class="text-slate-700 leading-relaxed mb-6">Un requerimiento debe cumplir estas características para ser válido:</p>
        <div class="overflow-x-auto">
          <table class="min-w-full border border-cyan-100 rounded-2xl overflow-hidden">
            <thead>
              <tr class="bg-white">
                <th class="px-4 py-3 text-left font-semibold">Criterio</th>
                <th class="px-4 py-3 text-left font-semibold">Significado</th>
                <th class="px-4 py-3 text-left font-semibold">Pregunta de validación</th>
              </tr>
            </thead>
            <tbody class="bg-white/90">
              <tr><td class="px-4 py-3 font-bold">S</td><td class="px-4 py-3 font-medium">Specific</td><td class="px-4 py-3 text-slate-600">¿Cualquier lector entendería lo mismo?</td></tr>
              <tr><td class="px-4 py-3 font-bold">M</td><td class="px-4 py-3 font-medium">Measurable</td><td class="px-4 py-3 text-slate-600">¿Qué métrica usarías para demostrar que se cumple?</td></tr>
              <tr><td class="px-4 py-3 font-bold">A</td><td class="px-4 py-3 font-medium">Achievable</td><td class="px-4 py-3 text-slate-600">¿Puede el equipo implementarlo con la tecnología actual?</td></tr>
              <tr><td class="px-4 py-3 font-bold">R</td><td class="px-4 py-3 font-medium">Relevant</td><td class="px-4 py-3 text-slate-600">¿Está alineado con los objetivos del negocio?</td></tr>
              <tr><td class="px-4 py-3 font-bold">T</td><td class="px-4 py-3 font-medium">Testable</td><td class="px-4 py-3 text-slate-600">¿Existen casos de prueba que lo verifiquen?</td></tr>
            </tbody>
          </table>
        </div>
        <div class="mt-6 bg-white rounded-2xl border border-cyan-100 p-6">
          <h3 class="font-bold text-slate-900 mb-3">Ejemplo de transformación SMART</h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-red-50 border border-red-100 rounded-xl p-4">
              <span class="text-red-600 font-semibold">Deficiente:</span> “El sistema debe ser rápido”.
            </div>
            <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <span class="text-emerald-600 font-semibold">SMART:</span> “El sistema debe responder a cualquier consulta del usuario en menos de 2 segundos para el 95% de las solicitudes”.
            </div>
          </div>
        </div>
      </section>

      <!-- DEFECTOS FRECUENTES -->
      <section class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-3xl">⚠️</div>
          <h2 class="text-3xl font-bold text-slate-900">Defectos frecuentes en los requerimientos</h2>
        </div>
        <div class="grid gap-4">
          <div class="flex gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-100">
            <div class="text-2xl">🌫️</div>
            <div>
              <strong>Ambigüedad:</strong> palabras con múltiples interpretaciones. Términos como “adecuado”, “fácil de usar”, “rápido”, “muchos”.
            </div>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-100">
            <div class="text-2xl">📄</div>
            <div>
              <strong>Incompletitud:</strong> falta información esencial. Ej.: “El sistema debe generar un informe” sin contenido, formato o frecuencia.
            </div>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-100">
            <div class="text-2xl">🔄</div>
            <div>
              <strong>Contradicción:</strong> dos requerimientos se contradicen. Ej.: “pagos anónimos” vs “toda transacción requiere autenticación”.
            </div>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-100">
            <div class="text-2xl">🚫</div>
            <div>
              <strong>Inviabilidad:</strong> exigir algo técnicamente imposible. Ej.: “tiempo de respuesta de cero segundos”.
            </div>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-100">
            <div class="text-2xl">🔍</div>
            <div>
              <strong>No verificabilidad:</strong> no existe procedimiento objetivo para medir su satisfacción. Ej.: “el sistema debe ser agradable”.
            </div>
          </div>
        </div>
      </section>

      <!-- TÉCNICAS DE VALIDACIÓN -->
      <section class="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-3xl p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center text-2xl">🛠️</div>
          <h2 class="text-3xl font-bold text-slate-900">Técnicas de validación más utilizadas</h2>
        </div>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white rounded-2xl border border-slate-200 p-5">
            <div class="font-semibold text-slate-900">Revisiones por pares</div>
            <p class="text-sm text-slate-600">Walkthroughs e inspecciones de la especificación.</p>
          </div>
          <div class="bg-white rounded-2xl border border-slate-200 p-5">
            <div class="font-semibold text-slate-900">Prototipado</div>
            <p class="text-sm text-slate-600">Construir una versión rápida para obtener retroalimentación temprana.</p>
          </div>
          <div class="bg-white rounded-2xl border border-slate-200 p-5">
            <div class="font-semibold text-slate-900">Modelos y análisis formal</div>
            <p class="text-sm text-slate-600">Uso de diagramas de estados o casos de uso para verificar consistencia.</p>
          </div>
          <div class="bg-white rounded-2xl border border-slate-200 p-5">
            <div class="font-semibold text-slate-900">Derivación de casos de prueba</div>
            <p class="text-sm text-slate-600">Escribir pruebas antes de implementar; si no se puede, el requerimiento es defectuoso.</p>
          </div>
          <div class="bg-white rounded-2xl border border-slate-200 p-5 md:col-span-2">
            <div class="font-semibold text-slate-900">Listas de verificación (checklists)</div>
            <p class="text-sm text-slate-600">Basadas en criterios SMART y en la lista de riesgos típicos.</p>
          </div>
        </div>
      </section>

      <!-- IMPORTANCIA DE VALIDAR TEMPRANO -->
      <section class="bg-slate-900 text-white rounded-3xl p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-3xl">💸</div>
          <h2 class="text-3xl font-bold">Importancia de validar temprano</h2>
        </div>
        <p class="text-slate-200 leading-relaxed mb-6">
          El costo de corregir un defecto de requisito crece exponencialmente. Wiegers presenta datos contundentes: 
          corregir un error en mantenimiento puede costar hasta <strong class="text-amber-300">100 veces más</strong> que durante la elicitación.
        </p>
        <div class="grid md:grid-cols-4 gap-4 text-center">
          <div class="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div class="text-2xl mb-2">📝</div>
            <p class="text-sm">Elicitación<br/><span class="text-cyan-300 font-bold">1x</span></p>
          </div>
          <div class="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div class="text-2xl mb-2">🎨</div>
            <p class="text-sm">Diseño<br/><span class="text-cyan-300 font-bold">3-5x</span></p>
          </div>
          <div class="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div class="text-2xl mb-2">💻</div>
            <p class="text-sm">Codificación<br/><span class="text-cyan-300 font-bold">10x</span></p>
          </div>
          <div class="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div class="text-2xl mb-2">🚀</div>
            <p class="text-sm">Producción<br/><span class="text-red-400 font-bold">50-200x</span></p>
          </div>
        </div>
        <p class="text-sm text-slate-400 mt-4 text-center">Invertir en validación reduce drásticamente los riesgos de fracaso del proyecto.</p>
      </section>

      <!-- RESUMEN -->
      <section class="bg-slate-900 text-white rounded-3xl p-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-3xl">📝</div>
          <h2 class="text-3xl font-bold">Resumen rápido</h2>
        </div>
        <div class="space-y-4">
          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-cyan-300 text-xl">•</div>
            <p class="text-slate-200 leading-relaxed"><strong>Validación</strong> = construir el producto correcto. <strong>Verificación</strong> = construirlo correctamente.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-cyan-300 text-xl">•</div>
            <p class="text-slate-200 leading-relaxed">Usa <strong>SMART</strong>: Specific, Measurable, Achievable, Relevant, Testable.</p>
          </div>
          <div class="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div class="text-cyan-300 text-xl">•</div>
            <p class="text-slate-200 leading-relaxed">Detecta y corrige ambigüedad, incompletitud, contradicciones e inviabilidad.</p>
          </div>
        </div>
      </section>

      <!-- REFERENCIAS -->
      <section class="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div class="flex items-center gap-3 mb-6">
          <div class="text-3xl">📚</div>
          <h2 class="text-3xl font-bold text-slate-900">Referencias bibliográficas</h2>
        </div>
        <div class="space-y-4 text-slate-700 leading-relaxed">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>Wiegers, K. E. & Beatty, J.</strong> <em>Software Requirements</em>. 3.ª ed. Microsoft Press, 2013. Cap. 14 y 12.</div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>Sommerville, I.</strong> <em>Software Engineering</em>. 10.ª ed. Pearson, 2016. Sección 4.7.</div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>Robertson, S. & Robertson, J.</strong> <em>Mastering the Requirements Process</em>. 3.ª ed. Addison-Wesley, 2013. Cap. 9.</div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>Pohl, K.</strong> <em>Requirements Engineering</em>. Springer, 2010. Cap. 9.</div>
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200"><strong>IEEE/ISO/IEC 29148:2018.</strong> Validación y verificación de requisitos.</div>
        </div>
      </section>

    </div>
  `
};