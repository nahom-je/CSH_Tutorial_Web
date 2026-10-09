// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = 'https://vexmmdlqlhakipnhoycn.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZleG1tZGxxbGhha2lwbmhveWNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1MzgzOTIsImV4cCI6MjEwNzExNDM5Mn0.bGOjfERDvftNyR3ripDl4WW67WROdhtMtchw1kewiVk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
