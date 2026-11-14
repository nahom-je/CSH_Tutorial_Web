-- ================================================================
-- CSH Tutorial — Mock Exam Database Schema & RLS Policies
-- Execute in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vexmmdlqlhakipnhoycn/sql/new
-- ================================================================

-- 1. exam_subjects table
CREATE TABLE IF NOT EXISTS public.exam_subjects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  field text CHECK (field IN ('Natural','Social','Both')),
  duration_minutes int NOT NULL,
  question_count int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 2. exam_questions table
CREATE TABLE IF NOT EXISTS public.exam_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id uuid REFERENCES public.exam_subjects(id) ON DELETE CASCADE,
  question_number int NOT NULL,
  question_text text NOT NULL,
  options jsonb NOT NULL,           -- [{"id":"A","text":"..."},{"id":"B","text":"..."}]
  correct_option text NOT NULL,     -- A, B, C, D, or E
  explanation text,
  needs_review boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Index for fast query by subject
CREATE INDEX IF NOT EXISTS idx_exam_questions_subject ON public.exam_questions(subject_id);

-- 3. exam_attempts table
CREATE TABLE IF NOT EXISTS public.exam_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name text NOT NULL,
  student_id text NOT NULL,
  phone text NOT NULL,
  field text NOT NULL,
  subject_id uuid REFERENCES public.exam_subjects(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  deadline_at timestamptz NOT NULL,
  submitted_at timestamptz,
  answers jsonb,
  correct_count int,
  total int,
  score numeric(4,1),
  created_at timestamptz DEFAULT now()
);

-- Index for attempt lookup by student and subject
CREATE INDEX IF NOT EXISTS idx_exam_attempts_student_subject ON public.exam_attempts(student_id, subject_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.exam_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Anyone can view active subjects (needed for catalog/cards)
DROP POLICY IF EXISTS "Public can view active exam subjects" ON public.exam_subjects;
CREATE POLICY "Public can view active exam subjects" ON public.exam_subjects
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Service role full access on subjects
DROP POLICY IF EXISTS "service_role_exam_subjects" ON public.exam_subjects;
CREATE POLICY "service_role_exam_subjects" ON public.exam_subjects
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- exam_questions: NO anon/public access! ONLY service role can read questions + answers
DROP POLICY IF EXISTS "service_role_exam_questions" ON public.exam_questions;
CREATE POLICY "service_role_exam_questions" ON public.exam_questions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- exam_attempts: ONLY service role can read & write
DROP POLICY IF EXISTS "service_role_exam_attempts" ON public.exam_attempts;
CREATE POLICY "service_role_exam_attempts" ON public.exam_attempts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

