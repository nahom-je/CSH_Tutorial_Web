-- ================================================================
-- Migration: Add order_code to exam_attempts table
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vexmmdlqlhakipnhoycn/sql/new
-- ================================================================

-- 1. Add order_code column (nullable so existing attempts remain valid)
ALTER TABLE public.exam_attempts 
  ADD COLUMN IF NOT EXISTS order_code text;

-- 2. Add partial unique index on (order_code, subject_id) for new rows with an order_code
CREATE UNIQUE INDEX IF NOT EXISTS idx_exam_attempts_order_subject 
  ON public.exam_attempts(order_code, subject_id) 
  WHERE order_code IS NOT NULL;

