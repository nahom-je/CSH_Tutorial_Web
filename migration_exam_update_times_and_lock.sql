-- Migration: Update exam durations to new schedule and lock all exams by default
UPDATE public.exam_subjects SET code = 'MATH', duration_minutes = 120, is_active = false WHERE code IN ('MATH', 'MATH-1011');
UPDATE public.exam_subjects SET code = 'PHYS', duration_minutes = 90, is_active = false WHERE code IN ('PHYS', 'PHYS-1011');
UPDATE public.exam_subjects SET code = 'LOGIC', duration_minutes = 60, is_active = false WHERE code IN ('LOGIC', 'PHIL-1011');
UPDATE public.exam_subjects SET code = 'PSYC', duration_minutes = 60, is_active = false WHERE code IN ('PSYC', 'PSYC-1011');
UPDATE public.exam_subjects SET code = 'GEOG', duration_minutes = 60, is_active = false WHERE code IN ('GEOG', 'GEOG-1011');
UPDATE public.exam_subjects SET code = 'ECON', duration_minutes = 60, is_active = false WHERE code IN ('ECON', 'ECON-1011');
