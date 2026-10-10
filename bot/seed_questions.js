// seed_questions.js — Seed Economics Quiz into Supabase
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function seedEconomics() {
  console.log('🚀 Starting Economics Quiz seeding to Supabase...');

  // Path to parsed JSON
  const jsonPath = path.resolve(__dirname, '../../questions/Social/parsed_economics.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Parsed economics data not found at: ${jsonPath}`);
    process.exit(1);
  }

  const chaptersData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`📖 Loaded ${chaptersData.length} chapters from JSON.`);

  // 1. Check or Insert Course
  const courseCode = 'ECON-1011';
  const courseTitle = 'Introduction to Economics';
  const courseStream = 'Social';

  let { data: existingCourse, error: fetchErr } = await supabase
    .from('courses')
    .select('id, code, title')
    .eq('code', courseCode)
    .maybeSingle();

  if (fetchErr) {
    console.error('❌ Error checking existing course:', fetchErr);
    process.exit(1);
  }

  let courseId = existingCourse?.id;

  if (existingCourse) {
    console.log(`ℹ️ Course ${courseCode} already exists (ID: ${courseId}). Checking existing chapters...`);
    // Delete existing questions & chapters to re-seed cleanly
    const { data: oldChapters } = await supabase
      .from('chapters')
      .select('id')
      .eq('course_id', courseId);

    if (oldChapters && oldChapters.length > 0) {
      const oldChIds = oldChapters.map((c) => c.id);
      console.log(`🧹 Cleaning up ${oldChIds.length} old chapters and their questions...`);
      await supabase.from('questions').delete().in('chapter_id', oldChIds);
      await supabase.from('chapters').delete().eq('course_id', courseId);
    }
  } else {
    console.log(`➕ Inserting new course: ${courseCode} - ${courseTitle} (${courseStream})...`);
    const { data: newCourse, error: createErr } = await supabase
      .from('courses')
      .insert({
        code: courseCode,
        title: courseTitle,
        stream: courseStream,
      })
      .select()
      .single();

    if (createErr) {
      console.error('❌ Error creating course:', createErr);
      process.exit(1);
    }
    courseId = newCourse.id;
    console.log(`✅ Course created with ID: ${courseId}`);
  }

  // 2. Insert Chapters & Questions
  let totalInsertedQ = 0;

  for (const ch of chaptersData) {
    console.log(`\n📌 Inserting Chapter ${ch.chapter_number}: ${ch.title}...`);
    const { data: chapterRow, error: chErr } = await supabase
      .from('chapters')
      .insert({
        course_id: courseId,
        chapter_number: ch.chapter_number,
        title: ch.title,
        description: ch.description || null,
      })
      .select()
      .single();

    if (chErr) {
      console.error(`❌ Failed to insert chapter ${ch.chapter_number}:`, chErr);
      process.exit(1);
    }

    const chapterId = chapterRow.id;
    console.log(`  Chapter ID: ${chapterId}. Inserting ${ch.questions.length} questions...`);

    const questionsToInsert = ch.questions.map((q) => ({
      chapter_id: chapterId,
      question_number: q.question_number,
      difficulty: q.difficulty,
      question_text: q.question_text,
      options: q.options,
      correct_option: q.correct_option,
      explanation: q.explanation,
    }));

    // Insert questions in batch
    const { error: qErr } = await supabase
      .from('questions')
      .insert(questionsToInsert);

    if (qErr) {
      console.error(`❌ Failed to insert questions for chapter ${ch.chapter_number}:`, qErr);
      process.exit(1);
    }

    totalInsertedQ += questionsToInsert.length;
    console.log(`  ✅ Chapter ${ch.chapter_number} seeded with ${questionsToInsert.length} questions.`);
  }

  console.log(`\n🎉 SUCCESS! Successfully seeded ${courseCode} (${courseTitle}):`);
  console.log(`   • Chapters: ${chaptersData.length}`);
  console.log(`   • Questions: ${totalInsertedQ}`);
}

seedEconomics().catch((err) => {
  console.error('Unhandled seeding error:', err);
  process.exit(1);
});
