-- V11__refactor_progress_tables.sql

-- 1. Eliminar tabla global_progress
DROP TABLE IF EXISTS global_progress;

-- 2. Modificar lesson_progress
-- 2a. Agregar columna temporal status (tipo texto con restricción)
ALTER TABLE lesson_progress
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE';

-- 2b. Migrar datos de 'completed' a 'status'
UPDATE lesson_progress
SET status = CASE
                 WHEN completed = TRUE AND best_score >= 70 THEN 'COMPLETED'
                 WHEN finalized = TRUE AND best_score < 70 THEN 'AVAILABLE'  -- reprobó, vuelve a estar disponible
                 WHEN finalized = FALSE AND total_score > 0 THEN 'IN_PROGRESS'
                 ELSE 'AVAILABLE'
    END;

-- 2c. Eliminar columna completed y las columnas de tiempo
ALTER TABLE lesson_progress
    DROP COLUMN completed,
    DROP COLUMN started_at,
    DROP COLUMN completed_at;

-- 2d. Agregar restricción CHECK para los valores permitidos
ALTER TABLE lesson_progress
    ADD CONSTRAINT chk_lesson_status CHECK (status IN ('LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED'));

-- 3. Modificar activity_progress
ALTER TABLE activity_progress
    DROP COLUMN time_taken_seconds,
    DROP COLUMN attempts,
    DROP COLUMN last_attempt_at;