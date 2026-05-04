-- ==============================================
-- Lessons
-- ==============================================
INSERT INTO lessons (title, description, order_index, is_exam) VALUES
                                                                   ('¿Qué es un Requerimiento?', 'Clase 1.1: Definición, importancia y conceptos iniciales.', 1, FALSE),
                                                                   ('Funcionales vs No Funcionales', 'Clase 1.2: Distinción entre requerimientos funcionales y no funcionales.', 2, FALSE),
                                                                   ('Entrevistas y Cuestionarios', 'Clase 1.3: Técnicas de elicitación y preparación de entrevistas.', 3, FALSE),
                                                                   ('User Stories y Criterios de Aceptación', 'Clase 1.4: Formato, INVEST y construcción de user stories.', 4, FALSE),
                                                                   ('Validación de Requerimientos (SMART)', 'Clase 1.5: Validación, defectos comunes y criterios SMART.', 5, FALSE),
                                                                   ('Examen Final: Sistema de Biblioteca Universitaria', 'Evaluación integral de todos los temas.', 6, TRUE);

-- ==============================================
-- Activities for Lesson 1: ¿Qué es un Requerimiento?
-- ==============================================
-- Activity 1.1: TRUE_FALSE (3 afirmaciones)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = '¿Qué es un Requerimiento?'),
           'Verdadero / Falso',
           '3 afirmaciones sobre el concepto de requerimiento.',
           'TRUE_FALSE',
           1,
           30,
           15,
           '{
             "items": [
               {
                 "id": "tf1",
                 "prompt": "Un requerimiento es simplemente una lista de deseos del cliente, sin necesidad de ser verificable.",
                 "correctAnswer": false,
                 "xpReward": 5,
                 "scoreReward": 10
               },
               {
                 "id": "tf2",
                 "prompt": "Los errores en los requerimientos pueden provocar sobrecostos y el fracaso del proyecto.",
                 "correctAnswer": true,
                 "xpReward": 5,
                 "scoreReward": 10
               },
               {
                 "id": "tf3",
                 "prompt": "Los requerimientos se limitan exclusivamente a las funciones que debe realizar el sistema.",
                 "correctAnswer": false,
                 "xpReward": 5,
                 "scoreReward": 10
               }
             ]
           }'::jsonb
       );

-- Activity 1.2: CHATBOT_SIMULATION (Diálogo Sr. García)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = '¿Qué es un Requerimiento?'),
           'Diálogo con el Sr. García',
           'Entrevista ramificada de 4 rondas.',
           'CHATBOT_SIMULATION',
           2,
           50,
           20,
           '{
             "items": [
               {
                 "id": "round1",
                 "avatar": "cliente",
                 "message": "Necesito un sistema informático para manejar a mis clientes, pero la verdad no sé bien qué quiero. ¿Puede ayudarme a aclarar lo que necesito?",
                 "options": [
                   {"id": "p1", "text": "¿Qué problemas específicos está teniendo con la forma en que ahora gestiona a sus clientes?", "scoreMultiplier": 1.0},
                   {"id": "p2", "text": "¿Qué tareas concretas le gustaría que el sistema realizara primero?", "scoreMultiplier": 0.8},
                   {"id": "p3", "text": "¿Me puede describir cómo es un día típico atendiendo a un cliente, desde que llega hasta que se va?", "scoreMultiplier": 0.6},
                   {"id": "p4", "text": "¿Aproximadamente cuántos clientes atiende al mes? ¿Y cuántos aparatos repara?", "scoreMultiplier": 0.6},
                   {"id": "p5", "text": "¿Tiene algún presupuesto aproximado para este sistema?", "scoreMultiplier": 0.2},
                   {"id": "p6", "text": "¿Prefiere que el sistema tenga una apariencia moderna con colores vivos?", "scoreMultiplier": 0.2},
                   {"id": "p7", "text": "¿Le gustaría que el sistema también enviara automáticamente ofertas por correo electrónico?", "scoreMultiplier": 0.0},
                   {"id": "p8", "text": "¿Quiere que la aplicación sea de escritorio o mejor una página web?", "scoreMultiplier": 0.0}
                 ],
                 "bestOption": "p1",
                 "xpReward": 5,
                 "scoreReward": 12
               },
               {
                 "id": "round2",
                 "avatar": "cliente",
                 "message": "Actualmente lo llevo todo en una libreta y en hojas de Excel sueltas. Se me pierden datos, no sé en qué estado está cada reparación y a veces olvido llamar al cliente cuando su aparato está listo.",
                 "options": [
                   {"id": "p1", "text": "¿Qué tareas concretas le gustaría que el sistema realizara primero?", "scoreMultiplier": 1.0},
                   {"id": "p3", "text": "¿Me puede describir cómo es un día típico atendiendo a un cliente, desde que llega hasta que se va?", "scoreMultiplier": 0.8},
                   {"id": "p4", "text": "¿Aproximadamente cuántos clientes atiende al mes? ¿Y cuántos aparatos repara?", "scoreMultiplier": 0.6},
                   {"id": "p5", "text": "¿Tiene algún presupuesto aproximado para este sistema?", "scoreMultiplier": 0.2},
                   {"id": "p6", "text": "¿Prefiere que el sistema tenga una apariencia moderna con colores vivos?", "scoreMultiplier": 0.2},
                   {"id": "p7", "text": "¿Le gustaría que el sistema también enviara automáticamente ofertas por correo electrónico?", "scoreMultiplier": 0.0},
                   {"id": "p8", "text": "¿Quiere que la aplicación sea de escritorio o mejor una página web?", "scoreMultiplier": 0.0}
                 ],
                 "bestOption": "p1",
                 "xpReward": 5,
                 "scoreReward": 12
               },
               {
                 "id": "round3",
                 "avatar": "cliente",
                 "message": "Principalmente quiero poder registrar cada reparación, saber en qué estado está y tener un historial por cliente.",
                 "options": [
                   {"id": "p3", "text": "¿Me puede describir cómo es un día típico atendiendo a un cliente, desde que llega hasta que se va?", "scoreMultiplier": 1.0},
                   {"id": "p4", "text": "¿Aproximadamente cuántos clientes atiende al mes? ¿Y cuántos aparatos repara?", "scoreMultiplier": 0.8},
                   {"id": "p5", "text": "¿Tiene algún presupuesto aproximado para este sistema?", "scoreMultiplier": 0.2},
                   {"id": "p6", "text": "¿Prefiere que el sistema tenga una apariencia moderna con colores vivos?", "scoreMultiplier": 0.2},
                   {"id": "p7", "text": "¿Le gustaría que el sistema también enviara automáticamente ofertas por correo electrónico?", "scoreMultiplier": 0.0},
                   {"id": "p8", "text": "¿Quiere que la aplicación sea de escritorio o mejor una página web?", "scoreMultiplier": 0.0}
                 ],
                 "bestOption": "p3",
                 "xpReward": 5,
                 "scoreReward": 13
               },
               {
                 "id": "round4",
                 "avatar": "cliente",
                 "message": "Claro. Cuando un cliente llega, apunto sus datos, describo el problema, le doy un presupuesto y después realizo la reparación.",
                 "options": [
                   {"id": "p4", "text": "¿Aproximadamente cuántos clientes atiende al mes? ¿Y cuántos aparatos repara?", "scoreMultiplier": 1.0},
                   {"id": "p5", "text": "¿Tiene algún presupuesto aproximado para este sistema?", "scoreMultiplier": 0.2},
                   {"id": "p6", "text": "¿Prefiere que el sistema tenga una apariencia moderna con colores vivos?", "scoreMultiplier": 0.2},
                   {"id": "p7", "text": "¿Le gustaría que el sistema también enviara automáticamente ofertas por correo electrónico?", "scoreMultiplier": 0.0},
                   {"id": "p8", "text": "¿Quiere que la aplicación sea de escritorio o mejor una página web?", "scoreMultiplier": 0.0}
                 ],
                 "bestOption": "p4",
                 "xpReward": 5,
                 "scoreReward": 13
               }
             ]
           }'::jsonb
       );

-- Activity 1.3: MATCH_PAIRS (emparejar 4 conceptos)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = '¿Qué es un Requerimiento?'),
           'Pares seleccionables',
           'Emparejar conceptos con su definición.',
           'MATCH_PAIRS',
           3,
           20,
           12,
           '{
             "items": [
               {
                 "id": "pair1",
                 "prompt": "Requerimiento",
                 "options": {
                   "concept": "Requerimiento",
                   "definitions": [
                     {"id": "d1", "text": "Condición o capacidad que debe cumplir un sistema para satisfacer una necesidad de un stakeholder."},
                     {"id": "d2", "text": "Persona u organización que tiene un interés o se ve afectada por el sistema."},
                     {"id": "d3", "text": "Proceso de obtener información de los stakeholders para descubrir los requerimientos reales."},
                     {"id": "d4", "text": "Documento formal que describe de manera detallada y estructurada lo que el sistema debe hacer."}
                   ]
                 },
                 "correctAnswer": "d1",
                 "xpReward": 3,
                 "scoreReward": 5
               },
               {
                 "id": "pair2",
                 "prompt": "Stakeholder",
                 "options": {
                   "concept": "Stakeholder",
                   "definitions": [
                     {"id": "d1", "text": "Condición o capacidad que debe cumplir un sistema para satisfacer una necesidad de un stakeholder."},
                     {"id": "d2", "text": "Persona u organización que tiene un interés o se ve afectada por el sistema."},
                     {"id": "d3", "text": "Proceso de obtener información de los stakeholders para descubrir los requerimientos reales."},
                     {"id": "d4", "text": "Documento formal que describe de manera detallada y estructurada lo que el sistema debe hacer."}
                   ]
                 },
                 "correctAnswer": "d2",
                 "xpReward": 3,
                 "scoreReward": 5
               },
               {
                 "id": "pair3",
                 "prompt": "Elicitación",
                 "options": {
                   "concept": "Elicitación",
                   "definitions": [
                     {"id": "d1", "text": "Condición o capacidad que debe cumplir un sistema para satisfacer una necesidad de un stakeholder."},
                     {"id": "d2", "text": "Persona u organización que tiene un interés o se ve afectada por el sistema."},
                     {"id": "d3", "text": "Proceso de obtener información de los stakeholders para descubrir los requerimientos reales."},
                     {"id": "d4", "text": "Documento formal que describe de manera detallada y estructurada lo que el sistema debe hacer."}
                   ]
                 },
                 "correctAnswer": "d3",
                 "xpReward": 3,
                 "scoreReward": 5
               },
               {
                 "id": "pair4",
                 "prompt": "Especificación de requerimientos",
                 "options": {
                   "concept": "Especificación de requerimientos",
                   "definitions": [
                     {"id": "d1", "text": "Condición o capacidad que debe cumplir un sistema para satisfacer una necesidad de un stakeholder."},
                     {"id": "d2", "text": "Persona u organización que tiene un interés o se ve afectada por el sistema."},
                     {"id": "d3", "text": "Proceso de obtener información de los stakeholders para descubrir los requerimientos reales."},
                     {"id": "d4", "text": "Documento formal que describe de manera detallada y estructurada lo que el sistema debe hacer."}
                   ]
                 },
                 "correctAnswer": "d4",
                 "xpReward": 3,
                 "scoreReward": 5
               }
             ]
           }'::jsonb
       );

-- ==============================================
-- Activities for Lesson 2: Funcionales vs No Funcionales
-- ==============================================
-- Activity 2.1: MULTIPLE_CHOICE (3 preguntas)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Funcionales vs No Funcionales'),
           'Opción múltiple',
           '3 preguntas de opción múltiple.',
           'MULTIPLE_CHOICE',
           1,
           30,
           15,
           '{
             "items": [
               {
                 "id": "mc1",
                 "prompt": "“El sistema debe enviar un correo electrónico al cliente cuando su pedido cambie de estado.” ¿Qué tipo de requerimiento es?",
                 "options": [
                   {"value": "a", "label": "No funcional, porque habla de un envío de correo."},
                   {"value": "b", "label": "Funcional, porque describe una acción concreta que el sistema debe realizar."},
                   {"value": "c", "label": "No funcional, porque involucra comunicación externa."},
                   {"value": "d", "label": "Funcional, pero solo si se especifica el formato del correo."}
                 ],
                 "correctAnswer": "b",
                 "xpReward": 5,
                 "scoreReward": 10
               },
               {
                 "id": "mc2",
                 "prompt": "“El sistema debe soportar hasta 500 usuarios concurrentes sin degradar el tiempo de respuesta.” ¿Qué tipo de requerimiento es?",
                 "options": [
                   {"value": "a", "label": "Funcional, porque especifica una capacidad del sistema."},
                   {"value": "b", "label": "No funcional, porque describe una condición de rendimiento."},
                   {"value": "c", "label": "Funcional, porque menciona usuarios."},
                   {"value": "d", "label": "No funcional, pero solo si se especifica el hardware."}
                 ],
                 "correctAnswer": "b",
                 "xpReward": 5,
                 "scoreReward": 10
               },
               {
                 "id": "mc3",
                 "prompt": "¿Cuál de las siguientes afirmaciones es verdadera?",
                 "options": [
                   {"value": "a", "label": "Todos los requerimientos no funcionales son restricciones de hardware."},
                   {"value": "b", "label": "Un requerimiento funcional nunca incluye referencias a la interfaz de usuario."},
                   {"value": "c", "label": "La seguridad y la usabilidad son ejemplos de requerimientos no funcionales."},
                   {"value": "d", "label": "Los requerimientos no funcionales son menos importantes que los funcionales."}
                 ],
                 "correctAnswer": "c",
                 "xpReward": 5,
                 "scoreReward": 10
               }
             ]
           }'::jsonb
       );

-- Activity 2.2: VENN_DIAGRAM (8 ítems)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Funcionales vs No Funcionales'),
           'Diagrama de Venn',
           'Arrastrar 8 ítems a las zonas Funcional, No funcional o Ambos.',
           'VENN_DIAGRAM',
           2,
           40,
           32,
           '{
             "items": [
               {
                 "id": "venn1",
                 "prompt": "El sistema debe permitir al usuario exportar el historial a Excel.",
                 "options": {
                   "zones": [
                     {"id": "functional", "label": "Funcional"},
                     {"id": "nonFunctional", "label": "No funcional"},
                     {"id": "both", "label": "Ambos / Frontera"}
                   ]
                 },
                 "correctAnswer": "functional",
                 "xpReward": 4,
                 "scoreReward": 5
               },
               {
                 "id": "venn2",
                 "prompt": "La aplicación web debe cargar completamente en menos de 3 segundos con una conexión de 5 Mbps.",
                 "options": {
                   "zones": [
                     {"id": "functional", "label": "Funcional"},
                     {"id": "nonFunctional", "label": "No funcional"},
                     {"id": "both", "label": "Ambos / Frontera"}
                   ]
                 },
                 "correctAnswer": "nonFunctional",
                 "xpReward": 4,
                 "scoreReward": 5
               },
               {
                 "id": "venn3",
                 "prompt": "El sistema debe validar que el correo ingresado tenga un formato correcto antes de registrar al usuario.",
                 "options": {
                   "zones": [
                     {"id": "functional", "label": "Funcional"},
                     {"id": "nonFunctional", "label": "No funcional"},
                     {"id": "both", "label": "Ambos / Frontera"}
                   ]
                 },
                 "correctAnswer": "functional",
                 "xpReward": 4,
                 "scoreReward": 5
               },
               {
                 "id": "venn4",
                 "prompt": "Los datos personales de los clientes deben estar cifrados tanto en tránsito como en reposo.",
                 "options": {
                   "zones": [
                     {"id": "functional", "label": "Funcional"},
                     {"id": "nonFunctional", "label": "No funcional"},
                     {"id": "both", "label": "Ambos / Frontera"}
                   ]
                 },
                 "correctAnswer": "nonFunctional",
                 "xpReward": 4,
                 "scoreReward": 5
               },
               {
                 "id": "venn5",
                 "prompt": "El sistema debe ser fácil de usar para personas mayores de 60 años sin formación técnica.",
                 "options": {
                   "zones": [
                     {"id": "functional", "label": "Funcional"},
                     {"id": "nonFunctional", "label": "No funcional"},
                     {"id": "both", "label": "Ambos / Frontera"}
                   ]
                 },
                 "correctAnswer": "nonFunctional",
                 "xpReward": 4,
                 "scoreReward": 5
               },
               {
                 "id": "venn6",
                 "prompt": "El administrador debe poder modificar el porcentaje de IVA desde un panel de configuración.",
                 "options": {
                   "zones": [
                     {"id": "functional", "label": "Funcional"},
                     {"id": "nonFunctional", "label": "No funcional"},
                     {"id": "both", "label": "Ambos / Frontera"}
                   ]
                 },
                 "correctAnswer": "both",
                 "xpReward": 4,
                 "scoreReward": 5
               },
               {
                 "id": "venn7",
                 "prompt": "El sistema debe funcionar correctamente en los navegadores Chrome, Firefox y Safari.",
                 "options": {
                   "zones": [
                     {"id": "functional", "label": "Funcional"},
                     {"id": "nonFunctional", "label": "No funcional"},
                     {"id": "both", "label": "Ambos / Frontera"}
                   ]
                 },
                 "correctAnswer": "nonFunctional",
                 "xpReward": 4,
                 "scoreReward": 5
               },
               {
                 "id": "venn8",
                 "prompt": "El sistema debe enviar una notificación push al móvil del usuario cuando su pago sea rechazado.",
                 "options": {
                   "zones": [
                     {"id": "functional", "label": "Funcional"},
                     {"id": "nonFunctional", "label": "No funcional"},
                     {"id": "both", "label": "Ambos / Frontera"}
                   ]
                 },
                 "correctAnswer": "functional",
                 "xpReward": 4,
                 "scoreReward": 5
               }
             ]
           }'::jsonb
       );

-- Activity 2.3: SWIPE_CARDS (10 tarjetas)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Funcionales vs No Funcionales'),
           'Tarjetas deslizables',
           'Deslizar tarjetas para clasificar enunciados.',
           'SWIPE_CARDS',
           3,
           30,
           30,
           '{
             "items": [
               {"id": "card1", "prompt": "El sistema debe generar un informe mensual de ventas.", "correctAnswer": "right", "xpReward": 3, "scoreReward": 3},
               {"id": "card2", "prompt": "La disponibilidad del sistema debe ser del 99.5 % durante el horario comercial.", "correctAnswer": "left", "xpReward": 3, "scoreReward": 3},
               {"id": "card3", "prompt": "El usuario debe poder filtrar los productos por rango de precios.", "correctAnswer": "right", "xpReward": 3, "scoreReward": 3},
               {"id": "card4", "prompt": "La aplicación debe soportar hasta 10 000 productos en el catálogo sin pérdida de rendimiento.", "correctAnswer": "left", "xpReward": 3, "scoreReward": 3},
               {"id": "card5", "prompt": "El sistema debe permitir la recuperación de contraseña mediante enlace enviado al correo registrado.", "correctAnswer": "right", "xpReward": 3, "scoreReward": 3},
               {"id": "card6", "prompt": "El tiempo de aprendizaje para que un cajero nuevo opere el sistema no debe superar 2 horas.", "correctAnswer": "left", "xpReward": 3, "scoreReward": 3},
               {"id": "card7", "prompt": "Cuando un cliente cancele una reserva, el sistema debe liberar automáticamente el cupo en menos de 1 minuto.", "correctAnswer": "right", "xpReward": 3, "scoreReward": 3},
               {"id": "card8", "prompt": "La base de datos debe poder recuperarse completamente en menos de 4 horas tras un fallo catastrófico.", "correctAnswer": "left", "xpReward": 3, "scoreReward": 3},
               {"id": "card9", "prompt": "El sistema debe registrar en un log cada acceso fallido, incluyendo IP y fecha.", "correctAnswer": "right", "xpReward": 3, "scoreReward": 3},
               {"id": "card10", "prompt": "El sistema debe cumplir con el estándar WCAG 2.1 nivel AA en todas sus páginas.", "correctAnswer": "left", "xpReward": 3, "scoreReward": 3}
             ]
           }'::jsonb
       );

-- ==============================================
-- Activities for Lesson 3: Entrevistas y Cuestionarios
-- ==============================================
-- Activity 3.1: DRAG_DROP_COLUMNS (clasificar 6 preguntas)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Entrevistas y Cuestionarios'),
           'Clasifica el tipo de pregunta',
           'Arrastrar 6 preguntas a las columnas: Abierta, Cerrada, Sesgada, De sondeo.',
           'DRAG_DROP_COLUMNS',
           1,
           30,
           18,
           '{
             "items": [
               {
                 "id": "drag1",
                 "prompt": "¿Podría describirme paso a paso cómo realiza actualmente el cierre de caja?",
                 "options": {
                   "columns": [
                     {"id": "abierta", "label": "Abierta"},
                     {"id": "cerrada", "label": "Cerrada"},
                     {"id": "sesgada", "label": "Sesgada"},
                     {"id": "sondeo", "label": "De sondeo"}
                   ]
                 },
                 "correctAnswer": "abierta",
                 "xpReward": 3,
                 "scoreReward": 5
               },
               {
                 "id": "drag2",
                 "prompt": "¿Cuántos clientes atienden en un día promedio?",
                 "options": {
                   "columns": [
                     {"id": "abierta", "label": "Abierta"},
                     {"id": "cerrada", "label": "Cerrada"},
                     {"id": "sesgada", "label": "Sesgada"},
                     {"id": "sondeo", "label": "De sondeo"}
                   ]
                 },
                 "correctAnswer": "cerrada",
                 "xpReward": 3,
                 "scoreReward": 5
               },
               {
                 "id": "drag3",
                 "prompt": "¿No cree que sería mejor unificar todas las pantallas en una sola interfaz?",
                 "options": {
                   "columns": [
                     {"id": "abierta", "label": "Abierta"},
                     {"id": "cerrada", "label": "Cerrada"},
                     {"id": "sesgada", "label": "Sesgada"},
                     {"id": "sondeo", "label": "De sondeo"}
                   ]
                 },
                 "correctAnswer": "sesgada",
                 "xpReward": 3,
                 "scoreReward": 5
               },
               {
                 "id": "drag4",
                 "prompt": "Usted mencionó que a veces se pierden pedidos. ¿Recuerda la última vez que ocurrió? Cuénteme qué pasó.",
                 "options": {
                   "columns": [
                     {"id": "abierta", "label": "Abierta"},
                     {"id": "cerrada", "label": "Cerrada"},
                     {"id": "sesgada", "label": "Sesgada"},
                     {"id": "sondeo", "label": "De sondeo"}
                   ]
                 },
                 "correctAnswer": "sondeo",
                 "xpReward": 3,
                 "scoreReward": 5
               },
               {
                 "id": "drag5",
                 "prompt": "¿Utilizan algún programa informático para gestionar el inventario?",
                 "options": {
                   "columns": [
                     {"id": "abierta", "label": "Abierta"},
                     {"id": "cerrada", "label": "Cerrada"},
                     {"id": "sesgada", "label": "Sesgada"},
                     {"id": "sondeo", "label": "De sondeo"}
                   ]
                 },
                 "correctAnswer": "cerrada",
                 "xpReward": 3,
                 "scoreReward": 5
               },
               {
                 "id": "drag6",
                 "prompt": "¿Qué es lo que más le frustra del sistema actual?",
                 "options": {
                   "columns": [
                     {"id": "abierta", "label": "Abierta"},
                     {"id": "cerrada", "label": "Cerrada"},
                     {"id": "sesgada", "label": "Sesgada"},
                     {"id": "sondeo", "label": "De sondeo"}
                   ]
                 },
                 "correctAnswer": "abierta",
                 "xpReward": 3,
                 "scoreReward": 5
               }
             ]
           }'::jsonb
       );

-- Activity 3.2: SORTABLE_LIST (ordenar 5 pasos)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Entrevistas y Cuestionarios'),
           'Ordena la preparación de una entrevista',
           'Ordenar los 5 pasos de preparación.',
           'SORTABLE_LIST',
           2,
           30,
           15,
           '{
             "items": [
               {"id": "step1", "content": "Definir el objetivo de la entrevista: ¿qué información necesito obtener exactamente?", "correctOrder": 0},
               {"id": "step2", "content": "Identificar al stakeholder adecuado: la persona que tiene el conocimiento y la autoridad sobre el tema.", "correctOrder": 1},
               {"id": "step3", "content": "Elaborar la guía de preguntas: preparar preguntas abiertas, cerradas y de sondeo, evitando sesgos.", "correctOrder": 2},
               {"id": "step4", "content": "Concertar la cita y explicar el propósito: el entrevistado debe saber la duración y el motivo.", "correctOrder": 3},
               {"id": "step5", "content": "Documentar los resultados inmediatamente después: pasar las notas en limpio y, si es posible, validarlas con el entrevistado.", "correctOrder": 4}
             ]
           }'::jsonb
       );

-- Activity 3.3: CHATBOT_SIMULATION (Entrevista Sra. Gómez)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Entrevistas y Cuestionarios'),
           'Entrevista simulada (Sra. Gómez)',
           '4 rondas para entrevistar a la directora de banca.',
           'CHATBOT_SIMULATION',
           3,
           40,
           20,
           '{
             "items": [
               {
                 "id": "round1",
                 "avatar": "cliente",
                 "message": "Gracias por venir. Como le comenté, queremos modernizar nuestra banca en línea. Actualmente los clientes solo pueden consultar saldos y hacer transferencias básicas, y el sistema se cae con frecuencia en quincenas. ¿Por dónde empezamos?",
                 "options": [
                   {"id": "a", "text": "¿Qué nuevas funcionalidades le gustaría que tuviera el portal?", "scoreMultiplier": 0.5},
                   {"id": "b", "text": "¿No le parece que lo más urgente es una app móvil con reconocimiento facial?", "scoreMultiplier": 0.0},
                   {"id": "c", "text": "Cuénteme, ¿cómo describiría la experiencia actual de sus clientes con la banca en línea? ¿Qué problemas son los más frecuentes?", "scoreMultiplier": 1.0}
                 ],
                 "bestOption": "c",
                 "xpReward": 5,
                 "scoreReward": 10
               },
               {
                 "id": "round2",
                 "avatar": "cliente",
                 "message": "Buena pregunta. Nuestros clientes se quejan de que el portal es muy lento y a veces no pueden hacer operaciones en horario de alta demanda. Además, el proceso para solicitar un préstamo o una tarjeta de crédito es completamente presencial; les gustaría poder iniciarlo en línea.",
                 "options": [
                   {"id": "a", "text": "¿Ha pensado en desarrollar una aplicación móvil separada o prefiere un portal web adaptativo?", "scoreMultiplier": 0.5},
                   {"id": "b", "text": "Respecto a los picos de uso, ¿podría darme datos concretos? Por ejemplo, ¿cuántos usuarios simultáneos intentan acceder en una quincena y cuántas operaciones se procesan?", "scoreMultiplier": 1.0},
                   {"id": "c", "text": "Los clientes mayores necesitan una interfaz más simple. ¿Qué le parecería un modo de alto contraste y un asistente virtual por voz?", "scoreMultiplier": 0.0}
                 ],
                 "bestOption": "b",
                 "xpReward": 5,
                 "scoreReward": 10
               },
               {
                 "id": "round3",
                 "avatar": "cliente",
                 "message": "En quincena tenemos hasta 300 usuarios simultáneos y unas 2000 transacciones por hora. Nuestro servidor actual no da abasto.",
                 "options": [
                   {"id": "a", "text": "¿Qué tipo de transacciones realizan con mayor frecuencia? ¿Hay algunas que sean más críticas que otras?", "scoreMultiplier": 1.0},
                   {"id": "b", "text": "¿Quiere que el nuevo sistema soporte 5000 transacciones por hora?", "scoreMultiplier": 0.5},
                   {"id": "c", "text": "Eso suena a un problema de hardware. ¿Han pensado en migrar a un proveedor de nube como AWS?", "scoreMultiplier": 0.0}
                 ],
                 "bestOption": "a",
                 "xpReward": 5,
                 "scoreReward": 10
               },
               {
                 "id": "round4",
                 "avatar": "cliente",
                 "message": "Principalmente transferencias y pagos de servicios. También consultas de saldo. Lo más crítico es que las transferencias no fallen, porque luego nos reclaman.",
                 "options": [
                   {"id": "a", "text": "Para ir cerrando, ¿hay algo más que no hayamos hablado y que considere importante para el proyecto?", "scoreMultiplier": 1.0},
                   {"id": "b", "text": "Perfecto. Entonces el sistema debe garantizar transferencias 100 % exitosas. ¿Qué otro requisito debo incluir?", "scoreMultiplier": 0.5},
                   {"id": "c", "text": "Creo que ya tengo suficiente. Le enviaré un prototipo la próxima semana. ¿Le parece?", "scoreMultiplier": 0.0}
                 ],
                 "bestOption": "a",
                 "xpReward": 5,
                 "scoreReward": 10
               }
             ]
           }'::jsonb
       );

-- ==============================================
-- Activities for Lesson 4: User Stories y Criterios de Aceptación
-- ==============================================
-- Activity 4.1: TRUE_FALSE (3 afirmaciones)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'User Stories y Criterios de Aceptación'),
           'Verdadero / Falso',
           '3 afirmaciones sobre user stories.',
           'TRUE_FALSE',
           1,
           30,
           15,
           '{
             "items": [
               {
                 "id": "tf1",
                 "prompt": "Una user story debe incluir obligatoriamente un rol, una función deseada y un beneficio esperado para considerarse bien formulada.",
                 "correctAnswer": true,
                 "xpReward": 5,
                 "scoreReward": 10
               },
               {
                 "id": "tf2",
                 "prompt": "Las user stories son propiedad exclusiva del Product Owner y no deben ser discutidas con el equipo de desarrollo.",
                 "correctAnswer": false,
                 "xpReward": 5,
                 "scoreReward": 10
               },
               {
                 "id": "tf3",
                 "prompt": "El acrónimo INVEST se utiliza para verificar que una user story tenga una interfaz visual atractiva.",
                 "correctAnswer": false,
                 "xpReward": 5,
                 "scoreReward": 10
               }
             ]
           }'::jsonb
       );

-- Activity 4.2: USER_STORY_BUILDER (4 historias)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'User Stories y Criterios de Aceptación'),
           'Constructor de user stories',
           'Completar 4 plantillas con tokens arrastrables.',
           'USER_STORY_BUILDER',
           2,
           40,
           24,
           '{
             "items": [
               {
                 "id": "story1",
                 "template": {
                   "slots": [
                     {"id": "rol", "label": "Como..."},
                     {"id": "accion", "label": "quiero..."},
                     {"id": "beneficio", "label": "para..."}
                   ]
                 },
                 "tokens": [
                   {"id": "token1", "text": "Alumno", "type": "rol"},
                   {"id": "token2", "text": "filtrar cursos por nivel de dificultad", "type": "accion"},
                   {"id": "token3", "text": "encontrar cursos adecuados a mi nivel", "type": "beneficio"},
                   {"id": "token4", "text": "Instructor", "type": "rol"},
                   {"id": "token5", "text": "subir un nuevo curso con videos y apuntes", "type": "accion"},
                   {"id": "token6", "text": "compartir mis conocimientos con los estudiantes", "type": "beneficio"},
                   {"id": "token7", "text": "Administrador", "type": "rol"},
                   {"id": "token8", "text": "generar un reporte mensual de inscripciones", "type": "accion"},
                   {"id": "token9", "text": "monitorear el desempeño del negocio", "type": "beneficio"},
                   {"id": "token10", "text": "marcar una lección como completada", "type": "accion"},
                   {"id": "token11", "text": "llevar un registro de mi progreso", "type": "beneficio"}
                 ],
                 "correctAnswers": {
                   "slot_rol": "token1",
                   "slot_accion": "token2",
                   "slot_beneficio": "token3"
                 },
                 "xpReward": 6,
                 "scoreReward": 10
               },
               {
                 "id": "story2",
                 "template": {
                   "slots": [
                     {"id": "rol", "label": "Como..."},
                     {"id": "accion", "label": "quiero..."},
                     {"id": "beneficio", "label": "para..."}
                   ]
                 },
                 "tokens": [
                   {"id": "token4", "text": "Instructor", "type": "rol"},
                   {"id": "token5", "text": "subir un nuevo curso con videos y apuntes", "type": "accion"},
                   {"id": "token6", "text": "compartir mis conocimientos con los estudiantes", "type": "beneficio"}
                 ],
                 "correctAnswers": {
                   "slot_rol": "token4",
                   "slot_accion": "token5",
                   "slot_beneficio": "token6"
                 },
                 "xpReward": 6,
                 "scoreReward": 10
               },
               {
                 "id": "story3",
                 "template": {
                   "slots": [
                     {"id": "rol", "label": "Como..."},
                     {"id": "accion", "label": "quiero..."},
                     {"id": "beneficio", "label": "para..."}
                   ]
                 },
                 "tokens": [
                   {"id": "token7", "text": "Administrador", "type": "rol"},
                   {"id": "token8", "text": "generar un reporte mensual de inscripciones", "type": "accion"},
                   {"id": "token9", "text": "monitorear el desempeño del negocio", "type": "beneficio"}
                 ],
                 "correctAnswers": {
                   "slot_rol": "token7",
                   "slot_accion": "token8",
                   "slot_beneficio": "token9"
                 },
                 "xpReward": 6,
                 "scoreReward": 10
               },
               {
                 "id": "story4",
                 "template": {
                   "slots": [
                     {"id": "rol", "label": "Como..."},
                     {"id": "accion", "label": "quiero..."},
                     {"id": "beneficio", "label": "para..."}
                   ]
                 },
                 "tokens": [
                   {"id": "token1", "text": "Alumno", "type": "rol"},
                   {"id": "token10", "text": "marcar una lección como completada", "type": "accion"},
                   {"id": "token11", "text": "llevar un registro de mi progreso", "type": "beneficio"}
                 ],
                 "correctAnswers": {
                   "slot_rol": "token1",
                   "slot_accion": "token10",
                   "slot_beneficio": "token11"
                 },
                 "xpReward": 6,
                 "scoreReward": 10
               }
             ]
           }'::jsonb
       );

-- Activity 4.3: SWIPE_CARDS (10 tarjetas de user stories bien/mal)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'User Stories y Criterios de Aceptación'),
           'Tarjetas deslizables: user stories',
           'Deslizar para clasificar user stories como bien o mal formuladas.',
           'SWIPE_CARDS',
           3,
           30,
           30,
           '{
             "items": [
               {"id": "sw1", "prompt": "Como usuario, quiero iniciar sesión.", "correctAnswer": "left", "xpReward": 3, "scoreReward": 3},
               {"id": "sw2", "prompt": "Como cliente, quiero filtrar productos por precio para encontrar ofertas.", "correctAnswer": "right", "xpReward": 3, "scoreReward": 3},
               {"id": "sw3", "prompt": "Como administrador, quiero un botón azul en la página de inicio.", "correctAnswer": "left", "xpReward": 3, "scoreReward": 3},
               {"id": "sw4", "prompt": "Como vendedor, quiero registrar una nueva venta para llevar el control de ingresos.", "correctAnswer": "right", "xpReward": 3, "scoreReward": 3},
               {"id": "sw5", "prompt": "Como sistema, quiero enviar una notificación por correo.", "correctAnswer": "left", "xpReward": 3, "scoreReward": 3},
               {"id": "sw6", "prompt": "Como usuario, quiero que la aplicación sea rápida.", "correctAnswer": "left", "xpReward": 3, "scoreReward": 3},
               {"id": "sw7", "prompt": "Quiero poder ver mis pedidos anteriores.", "correctAnswer": "left", "xpReward": 3, "scoreReward": 3},
               {"id": "sw8", "prompt": "Como cliente, quiero cancelar un pedido que aún no ha sido enviado para evitar gastos innecesarios.", "correctAnswer": "right", "xpReward": 3, "scoreReward": 3},
               {"id": "sw9", "prompt": "Como administrador, quiero que el sistema utilice una base de datos SQL Server.", "correctAnswer": "left", "xpReward": 3, "scoreReward": 3},
               {"id": "sw10", "prompt": "Como alumno, quiero descargar el certificado del curso en PDF para adjuntarlo a mi currículum.", "correctAnswer": "right", "xpReward": 3, "scoreReward": 3}
             ]
           }'::jsonb
       );

-- ==============================================
-- Activities for Lesson 5: Validación de Requerimientos (SMART)
-- ==============================================
-- Activity 5.1: MULTIPLE_CHOICE (3 preguntas)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Validación de Requerimientos (SMART)'),
           'Opción múltiple',
           '3 preguntas sobre validación de requerimientos.',
           'MULTIPLE_CHOICE',
           1,
           30,
           15,
           '{
             "items": [
               {
                 "id": "mc1",
                 "prompt": "¿Cuál de las siguientes características NO forma parte del acrónimo SMART para evaluar requerimientos?",
                 "options": [
                   {"value": "a", "label": "Specific (específico)"},
                   {"value": "b", "label": "Measurable (medible)"},
                   {"value": "c", "label": "Elegant (elegante)"},
                   {"value": "d", "label": "Testable (verificable)"}
                 ],
                 "correctAnswer": "c",
                 "xpReward": 5,
                 "scoreReward": 10
               },
               {
                 "id": "mc2",
                 "prompt": "Un requerimiento que indica: “El sistema debe procesar los pagos rápido” presenta principalmente un defecto de:",
                 "options": [
                   {"value": "a", "label": "Incompletitud"},
                   {"value": "b", "label": "Ambigüedad"},
                   {"value": "c", "label": "Inviabilidad"},
                   {"value": "d", "label": "Contradicción"}
                 ],
                 "correctAnswer": "b",
                 "xpReward": 5,
                 "scoreReward": 10
               },
               {
                 "id": "mc3",
                 "prompt": "¿Cuál de las siguientes opciones es una técnica de validación de requerimientos reconocida?",
                 "options": [
                   {"value": "a", "label": "Refactorización del código"},
                   {"value": "b", "label": "Revisión por pares (walkthrough)"},
                   {"value": "c", "label": "Pruebas de carga"},
                   {"value": "d", "label": "Integración continua"}
                 ],
                 "correctAnswer": "b",
                 "xpReward": 5,
                 "scoreReward": 10
               }
             ]
           }'::jsonb
       );

-- Activity 5.2: REWRITE_REQUIREMENT (5 ítems)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Validación de Requerimientos (SMART)'),
           'Reescribe el requisito',
           'Corregir 5 requerimientos defectuosos.',
           'REWRITE_REQUIREMENT',
           2,
           40,
           30,
           '{
             "items": [
               {
                 "id": "rewrite1",
                 "prompt": "El sistema debe ser rápido.",
                 "highlighted": ["rápido"],
                 "hints": {"rápido": "Define un tiempo máximo de respuesta en segundos."},
                 "correctAnswer": "El sistema debe responder a cualquier petición en menos de 2 segundos para el 95 % de las solicitudes.",
                 "xpReward": 6,
                 "scoreReward": 8
               },
               {
                 "id": "rewrite2",
                 "prompt": "El sistema debe soportar muchos usuarios.",
                 "highlighted": ["muchos"],
                 "hints": {"muchos": "Especifica una cantidad concreta: usuarios concurrentes, totales, etc."},
                 "correctAnswer": "El sistema debe soportar hasta 500 usuarios concurrentes.",
                 "xpReward": 6,
                 "scoreReward": 8
               },
               {
                 "id": "rewrite3",
                 "prompt": "La interfaz debe ser fácil de usar.",
                 "highlighted": ["fácil"],
                 "hints": {"fácil": "¿Cómo medirías la facilidad? Piensa en tiempo de aprendizaje o tasa de errores."},
                 "correctAnswer": "Un usuario nuevo debe poder completar una compra en menos de 5 minutos.",
                 "xpReward": 6,
                 "scoreReward": 8
               },
               {
                 "id": "rewrite4",
                 "prompt": "El sistema debe generar informes adecuados.",
                 "highlighted": ["adecuados"],
                 "hints": {"adecuados": "Define contenido, formato y frecuencia del informe."},
                 "correctAnswer": "El sistema debe generar un informe semanal en PDF con las ventas desglosadas por producto.",
                 "xpReward": 6,
                 "scoreReward": 8
               },
               {
                 "id": "rewrite5",
                 "prompt": "El sistema debe ser seguro.",
                 "highlighted": ["seguro"],
                 "hints": {"seguro": "¿Qué medidas de seguridad concretas implementará?"},
                 "correctAnswer": "El sistema debe cifrar los datos personales con AES-256 y exigir autenticación de dos factores para los administradores.",
                 "xpReward": 6,
                 "scoreReward": 8
               }
             ]
           }'::jsonb
       );

-- Activity 5.3: DRAG_DROP_COLUMNS (clasificar 6 defectos)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Validación de Requerimientos (SMART)'),
           'Clasifica el defecto',
           'Arrastrar enunciados a Ambigüedad, Incompletitud o Contradicción.',
           'DRAG_DROP_COLUMNS',
           3,
           30,
           18,
           '{
             "items": [
               {
                 "id": "defect1",
                 "prompt": "El sistema debe responder rápidamente.",
                 "options": {
                   "columns": [
                     {"id": "amb", "label": "Ambigüedad"},
                     {"id": "inc", "label": "Incompletitud"},
                     {"id": "cont", "label": "Contradicción"}
                   ]
                 },
                 "correctAnswer": "amb",
                 "xpReward": 3,
                 "scoreReward": 5
               },
               {
                 "id": "defect2",
                 "prompt": "El sistema debe generar un reporte de ventas.",
                 "options": {
                   "columns": [
                     {"id": "amb", "label": "Ambigüedad"},
                     {"id": "inc", "label": "Incompletitud"},
                     {"id": "cont", "label": "Contradicción"}
                   ]
                 },
                 "correctAnswer": "inc",
                 "xpReward": 3,
                 "scoreReward": 5
               },
               {
                 "id": "defect3",
                 "prompt": "El sistema debe estar disponible 24/7 y además realizar copias de seguridad cada medianoche.",
                 "options": {
                   "columns": [
                     {"id": "amb", "label": "Ambigüedad"},
                     {"id": "inc", "label": "Incompletitud"},
                     {"id": "cont", "label": "Contradicción"}
                   ]
                 },
                 "correctAnswer": "cont",
                 "xpReward": 3,
                 "scoreReward": 5
               },
               {
                 "id": "defect4",
                 "prompt": "El sistema debe ser compatible con todos los navegadores populares.",
                 "options": {
                   "columns": [
                     {"id": "amb", "label": "Ambigüedad"},
                     {"id": "inc", "label": "Incompletitud"},
                     {"id": "cont", "label": "Contradicción"}
                   ]
                 },
                 "correctAnswer": "amb",
                 "xpReward": 3,
                 "scoreReward": 5
               },
               {
                 "id": "defect5",
                 "prompt": "El sistema debe permitir el acceso a cualquier persona en internet y a la vez restringir el acceso solo a personal autorizado.",
                 "options": {
                   "columns": [
                     {"id": "amb", "label": "Ambigüedad"},
                     {"id": "inc", "label": "Incompletitud"},
                     {"id": "cont", "label": "Contradicción"}
                   ]
                 },
                 "correctAnswer": "cont",
                 "xpReward": 3,
                 "scoreReward": 5
               },
               {
                 "id": "defect6",
                 "prompt": "El sistema debe calcular el impuesto.",
                 "options": {
                   "columns": [
                     {"id": "amb", "label": "Ambigüedad"},
                     {"id": "inc", "label": "Incompletitud"},
                     {"id": "cont", "label": "Contradicción"}
                   ]
                 },
                 "correctAnswer": "inc",
                 "xpReward": 3,
                 "scoreReward": 5
               }
             ]
           }'::jsonb
       );

-- ==============================================
-- Activities for Examen Final (10 preguntas, cada una como actividad independiente)
-- ==============================================
-- Pregunta 1: MULTIPLE_CHOICE (Funcional vs No funcional)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Examen Final: Sistema de Biblioteca Universitaria'),
           'Pregunta 1',
           'Opción múltiple: tipo de requerimiento.',
           'MULTIPLE_CHOICE',
           1,
           10,
           5,
           '{
             "items": [
               {
                 "id": "q1",
                 "prompt": "“El sistema debe permitir que un estudiante renueve un préstamo siempre que no haya otro usuario que haya reservado el mismo libro.” Selecciona el tipo de requerimiento:",
                 "options": [
                   {"value": "a", "label": "No funcional, porque habla de una restricción."},
                   {"value": "b", "label": "Funcional, porque describe una acción concreta que realiza el sistema."},
                   {"value": "c", "label": "No funcional, porque menciona “reserva”."},
                   {"value": "d", "label": "Funcional, pero solo si se implementa con un botón visible."}
                 ],
                 "correctAnswer": "b",
                 "xpReward": 5,
                 "scoreReward": 10
               }
             ]
           }'::jsonb
       );

-- Pregunta 2: MULTIPLE_CHOICE (No funcional)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Examen Final: Sistema de Biblioteca Universitaria'),
           'Pregunta 2',
           'Opción múltiple: tipo de requerimiento (rendimiento).',
           'MULTIPLE_CHOICE',
           2,
           10,
           5,
           '{
             "items": [
               {
                 "id": "q2",
                 "prompt": "“El sistema debe ser capaz de manejar hasta 200 solicitudes simultáneas en las horas pico sin que el tiempo de respuesta supere los 3 segundos.” Selecciona el tipo de requerimiento:",
                 "options": [
                   {"value": "a", "label": "Funcional, porque especifica un límite de tiempo."},
                   {"value": "b", "label": "Funcional, porque menciona “solicitudes”."},
                   {"value": "c", "label": "No funcional, porque define una restricción de rendimiento."},
                   {"value": "d", "label": "No funcional, pero solo si se mide con una herramienta."}
                 ],
                 "correctAnswer": "c",
                 "xpReward": 5,
                 "scoreReward": 10
               }
             ]
           }'::jsonb
       );

-- Pregunta 3: TRUE_FALSE (Integración de pagos)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Examen Final: Sistema de Biblioteca Universitaria'),
           'Pregunta 3',
           'Verdadero/Falso: integración de pagos.',
           'TRUE_FALSE',
           3,
           10,
           5,
           '{
             "items": [
               {
                 "id": "q3",
                 "prompt": "“La integración con el sistema de pagos en línea es un requerimiento no funcional, porque describe una interfaz externa.”",
                 "correctAnswer": false,
                 "xpReward": 5,
                 "scoreReward": 10
               }
             ]
           }'::jsonb
       );

-- Pregunta 4: TRUE_FALSE (Multas)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Examen Final: Sistema de Biblioteca Universitaria'),
           'Pregunta 4',
           'Verdadero/Falso: multas.',
           'TRUE_FALSE',
           4,
           10,
           5,
           '{
             "items": [
               {
                 "id": "q4",
                 "prompt": "“Que las multas sean de $1,000 por día es un requerimiento funcional, porque define un valor monetario concreto.”",
                 "correctAnswer": true,
                 "xpReward": 5,
                 "scoreReward": 10
               }
             ]
           }'::jsonb
       );

-- Pregunta 5: SWIPE_CARDS (5 user stories)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Examen Final: Sistema de Biblioteca Universitaria'),
           'Pregunta 5',
           'Tarjetas deslizables: user stories bien/mal.',
           'SWIPE_CARDS',
           5,
           10,
           10,
           '{
             "items": [
               {"id": "ex_sw1", "prompt": "Como estudiante, quiero reservar un libro para asegurarme de que esté disponible cuando lo necesite.", "correctAnswer": "right", "xpReward": 2, "scoreReward": 2},
               {"id": "ex_sw2", "prompt": "Como usuario, quiero que el sistema utilice una base de datos en PostgreSQL.", "correctAnswer": "left", "xpReward": 2, "scoreReward": 2},
               {"id": "ex_sw3", "prompt": "Quiero poder ver los libros que tengo prestados.", "correctAnswer": "left", "xpReward": 2, "scoreReward": 2},
               {"id": "ex_sw4", "prompt": "Como bibliotecario, quiero generar un reporte semanal de los libros más prestados para identificar tendencias de lectura.", "correctAnswer": "right", "xpReward": 2, "scoreReward": 2},
               {"id": "ex_sw5", "prompt": "Como profesor, quiero que el sistema sea rápido.", "correctAnswer": "left", "xpReward": 2, "scoreReward": 2}
             ]
           }'::jsonb
       );

-- Pregunta 6: VENN_DIAGRAM (5 ítems)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Examen Final: Sistema de Biblioteca Universitaria'),
           'Pregunta 6',
           'Diagrama de Venn: clasificar en Funcional / No funcional / Ambos.',
           'VENN_DIAGRAM',
           6,
           10,
           10,
           '{
             "items": [
               {
                 "id": "ex_venn1",
                 "prompt": "El personal debe poder registrar la devolución de un libro escaneando el código de barras.",
                 "options": {
                   "zones": [
                     {"id": "functional", "label": "Funcional"},
                     {"id": "nonFunctional", "label": "No funcional"},
                     {"id": "both", "label": "Ambos / Frontera"}
                   ]
                 },
                 "correctAnswer": "functional",
                 "xpReward": 2,
                 "scoreReward": 2
               },
               {
                 "id": "ex_venn2",
                 "prompt": "El sistema debe estar disponible el 99.5 % del horario de atención.",
                 "options": {
                   "zones": [
                     {"id": "functional", "label": "Funcional"},
                     {"id": "nonFunctional", "label": "No funcional"},
                     {"id": "both", "label": "Ambos / Frontera"}
                   ]
                 },
                 "correctAnswer": "nonFunctional",
                 "xpReward": 2,
                 "scoreReward": 2
               },
               {
                 "id": "ex_venn3",
                 "prompt": "El sistema debe ser fácil de usar por los bibliotecarios, que tienen conocimientos informáticos básicos.",
                 "options": {
                   "zones": [
                     {"id": "functional", "label": "Funcional"},
                     {"id": "nonFunctional", "label": "No funcional"},
                     {"id": "both", "label": "Ambos / Frontera"}
                   ]
                 },
                 "correctAnswer": "nonFunctional",
                 "xpReward": 2,
                 "scoreReward": 2
               },
               {
                 "id": "ex_venn4",
                 "prompt": "El sistema debe permitir modificar el monto de la multa diaria sin necesidad de desplegar una nueva versión.",
                 "options": {
                   "zones": [
                     {"id": "functional", "label": "Funcional"},
                     {"id": "nonFunctional", "label": "No funcional"},
                     {"id": "both", "label": "Ambos / Frontera"}
                   ]
                 },
                 "correctAnswer": "both",
                 "xpReward": 2,
                 "scoreReward": 2
               },
               {
                 "id": "ex_venn5",
                 "prompt": "Los datos de los estudiantes deben transmitirse cifrados con TLS 1.2.",
                 "options": {
                   "zones": [
                     {"id": "functional", "label": "Funcional"},
                     {"id": "nonFunctional", "label": "No funcional"},
                     {"id": "both", "label": "Ambos / Frontera"}
                   ]
                 },
                 "correctAnswer": "nonFunctional",
                 "xpReward": 2,
                 "scoreReward": 2
               }
             ]
           }'::jsonb
       );

-- Pregunta 7: USER_STORY_BUILDER (construir una historia)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Examen Final: Sistema de Biblioteca Universitaria'),
           'Pregunta 7',
           'Construir user story para el bibliotecario.',
           'USER_STORY_BUILDER',
           7,
           10,
           6,
           '{
             "items": [
               {
                 "id": "story_ex",
                 "template": {
                   "slots": [
                     {"id": "rol", "label": "Como..."},
                     {"id": "accion", "label": "quiero..."},
                     {"id": "beneficio", "label": "para..."}
                   ]
                 },
                 "tokens": [
                   {"id": "token1", "text": "Bibliotecario", "type": "rol"},
                   {"id": "token2", "text": "ver la lista de préstamos vencidos", "type": "accion"},
                   {"id": "token3", "text": "para aplicar las multas correspondientes", "type": "beneficio"},
                   {"id": "token4", "text": "Estudiante", "type": "rol"}
                 ],
                 "correctAnswers": {
                   "slot_rol": "token1",
                   "slot_accion": "token2",
                   "slot_beneficio": "token3"
                 },
                 "xpReward": 6,
                 "scoreReward": 10
               }
             ]
           }'::jsonb
       );

-- Pregunta 8: REWRITE_REQUIREMENT (reescribir requisito defectuoso)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Examen Final: Sistema de Biblioteca Universitaria'),
           'Pregunta 8',
           'Reescribe el requisito defectuoso.',
           'REWRITE_REQUIREMENT',
           8,
           10,
           8,
           '{
             "items": [
               {
                 "id": "rewrite_ex",
                 "prompt": "El sistema debe manejar muchas reservas rápido.",
                 "highlighted": ["muchas", "rápido"],
                 "hints": {
                   "muchas": "Especifica una cantidad concreta (por ejemplo, número de reservas simultáneas).",
                   "rápido": "Define un tiempo máximo de respuesta en segundos o milisegundos."
                 },
                 "correctAnswer": "El sistema debe procesar hasta 50 reservas simultáneas en menos de 2 segundos.",
                 "xpReward": 8,
                 "scoreReward": 10
               }
             ]
           }'::jsonb
       );

-- Pregunta 9: MATCH_PAIRS (conceptos de validación)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Examen Final: Sistema de Biblioteca Universitaria'),
           'Pregunta 9',
           'Emparejar conceptos de validación con su definición.',
           'MATCH_PAIRS',
           9,
           10,
           10,
           '{
             "items": [
               {
                 "id": "pair_ex1",
                 "prompt": "Validación",
                 "options": {
                   "concept": "Validación",
                   "definitions": [
                     {"id": "d1", "text": "Confirma que el conjunto de requerimientos satisface las necesidades de los stakeholders."},
                     {"id": "d2", "text": "Confirma que los artefactos de requerimientos cumplen con estándares y reglas establecidos."},
                     {"id": "d3", "text": "Defecto por el cual un requerimiento puede interpretarse de más de una manera."},
                     {"id": "d4", "text": "Defecto que ocurre cuando falta información esencial en el requerimiento."}
                   ]
                 },
                 "correctAnswer": "d1",
                 "xpReward": 2,
                 "scoreReward": 2.5
               },
               {
                 "id": "pair_ex2",
                 "prompt": "Verificación",
                 "options": {
                   "concept": "Verificación",
                   "definitions": [
                     {"id": "d1", "text": "Confirma que el conjunto de requerimientos satisface las necesidades de los stakeholders."},
                     {"id": "d2", "text": "Confirma que los artefactos de requerimientos cumplen con estándares y reglas establecidos."},
                     {"id": "d3", "text": "Defecto por el cual un requerimiento puede interpretarse de más de una manera."},
                     {"id": "d4", "text": "Defecto que ocurre cuando falta información esencial en el requerimiento."}
                   ]
                 },
                 "correctAnswer": "d2",
                 "xpReward": 2,
                 "scoreReward": 2.5
               },
               {
                 "id": "pair_ex3",
                 "prompt": "Ambigüedad",
                 "options": {
                   "concept": "Ambigüedad",
                   "definitions": [
                     {"id": "d1", "text": "Confirma que el conjunto de requerimientos satisface las necesidades de los stakeholders."},
                     {"id": "d2", "text": "Confirma que los artefactos de requerimientos cumplen con estándares y reglas establecidos."},
                     {"id": "d3", "text": "Defecto por el cual un requerimiento puede interpretarse de más de una manera."},
                     {"id": "d4", "text": "Defecto que ocurre cuando falta información esencial en el requerimiento."}
                   ]
                 },
                 "correctAnswer": "d3",
                 "xpReward": 2,
                 "scoreReward": 2.5
               },
               {
                 "id": "pair_ex4",
                 "prompt": "Incompletitud",
                 "options": {
                   "concept": "Incompletitud",
                   "definitions": [
                     {"id": "d1", "text": "Confirma que el conjunto de requerimientos satisface las necesidades de los stakeholders."},
                     {"id": "d2", "text": "Confirma que los artefactos de requerimientos cumplen con estándares y reglas establecidos."},
                     {"id": "d3", "text": "Defecto por el cual un requerimiento puede interpretarse de más de una manera."},
                     {"id": "d4", "text": "Defecto que ocurre cuando falta información esencial en el requerimiento."}
                   ]
                 },
                 "correctAnswer": "d4",
                 "xpReward": 2,
                 "scoreReward": 2.5
               }
             ]
           }'::jsonb
       );

-- Pregunta 10: REWRITE_REQUIREMENT (identificar lagunas – texto libre, no evaluado automáticamente)
INSERT INTO activities (lesson_id, title, description, type, order_index, max_score, max_xp, configuration)
VALUES (
           (SELECT id FROM lessons WHERE title = 'Examen Final: Sistema de Biblioteca Universitaria'),
           'Pregunta 10',
           'Identifica 3 requisitos faltantes.',
           'REWRITE_REQUIREMENT',
           10,
           10,
           5,
           '{
             "items": [
               {
                 "id": "gaps",
                 "prompt": "Escribe tres requisitos que consideres que faltan en la descripción del caso (funcionales o no funcionales).",
                 "highlighted": [],
                 "hints": {},
                 "correctAnswer": "",
                 "xpReward": 5,
                 "scoreReward": 10
               }
             ]
           }'::jsonb
       );