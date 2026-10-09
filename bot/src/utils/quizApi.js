// src/utils/quizApi.js — Fetch and cache courses, chapters, and questions from Supabase
import { logger } from "./logger.js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

// In-memory caches to make Telegram button clicks 0ms instant
let cachedCourses = null;
const cachedChaptersByCourse = new Map();
const cachedQuestionsByChapter = new Map();

/**
 * Fetch all available courses
 */
export async function getQuizCourses() {
  if (cachedCourses && cachedCourses.length > 0) {
    return cachedCourses;
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/courses?select=*&order=code`, {
      headers: HEADERS,
    });
    if (!res.ok) throw new Error(`Courses fetch failed: ${res.status}`);
    const data = await res.json();
    cachedCourses = data || [];
    return cachedCourses;
  } catch (err) {
    logger.error(`Error loading quiz courses: ${err.message}`);
    return cachedCourses || [];
  }
}

/**
 * Fetch chapters for a given course
 */
export async function getQuizChapters(courseId) {
  if (cachedChaptersByCourse.has(courseId)) {
    return cachedChaptersByCourse.get(courseId);
  }
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/chapters?course_id=eq.${encodeURIComponent(courseId)}&select=id,chapter_number,title,description&order=chapter_number`,
      { headers: HEADERS }
    );
    if (!res.ok) throw new Error(`Chapters fetch failed: ${res.status}`);
    const data = await res.json();
    const sorted = data || [];
    cachedChaptersByCourse.set(courseId, sorted);
    return sorted;
  } catch (err) {
    logger.error(`Error loading chapters for course ${courseId}: ${err.message}`);
    return [];
  }
}

/**
 * Fetch questions for a chapter
 */
export async function getQuizQuestions(chapterId) {
  if (cachedQuestionsByChapter.has(chapterId)) {
    return cachedQuestionsByChapter.get(chapterId);
  }
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/questions?chapter_id=eq.${encodeURIComponent(chapterId)}&select=id,question_number,difficulty,question_text,options,correct_option,explanation&order=question_number`,
      { headers: HEADERS }
    );
    if (!res.ok) throw new Error(`Questions fetch failed: ${res.status}`);
    const data = await res.json();
    const questions = data || [];
    cachedQuestionsByChapter.set(chapterId, questions);
    return questions;
  } catch (err) {
    logger.error(`Error loading questions for chapter ${chapterId}: ${err.message}`);
    return [];
  }
}
