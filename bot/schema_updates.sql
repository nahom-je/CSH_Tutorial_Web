-- ==============================================================================
-- CSH Tutorial — Database Updates (Single-Device Binding & Drip-Locked Chapters)
-- ==============================================================================
-- Run these SQL statements in your Supabase Project -> SQL Editor
-- Dashboard URL: https://supabase.com/dashboard/project/vexmmdlqlhakipnhoycn/sql
-- ==============================================================================

-- 1. Anti-Sharing Device Binding:
-- Adds device_id to the orders table.
-- When a student logs in, their device ID is saved here.
-- Other devices attempting to use the same order code will be blocked until
-- the student resets it via Telegram bot (/resetdevice).
ALTER TABLE orders ADD COLUMN IF NOT EXISTS device_id TEXT;

-- 2. Drip-Feeding Chapters:
-- Adds is_locked boolean to chapters table.
-- By default FALSE (open).
-- Set to TRUE for future chapters that haven't had their video lessons released yet.
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;

-- ==============================================================================
-- Quick Admin Utilities (Optional):
-- ==============================================================================
-- To lock all chapters greater than Chapter 1 for a fresh cohort:
-- UPDATE chapters SET is_locked = TRUE WHERE chapter_number > 1;

-- To verify columns:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'device_id';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'chapters' AND column_name = 'is_locked';
