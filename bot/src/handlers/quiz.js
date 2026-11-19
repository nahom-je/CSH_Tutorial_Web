// src/handlers/quiz.js — Retired Quiz Handler (Redirects to Mock Exam Portal)
import { EXAM_PLATFORM_URL } from "../../config.js";

export function registerQuizHandler(bot) {
  const examRedirectMsg =
    `ℹ️ <b>Notice:</b> Chapter quizzes are no longer active.\n\n` +
    `Please visit the official <b>Mock Exam Portal</b> to take your timed mock exams and view your results:\n` +
    `🌐 <a href="${EXAM_PLATFORM_URL}">CSH Mock Exam Portal</a>`;

  const examKeyboard = {
    inline_keyboard: [
      [{ text: "🎯 Open Mock Exam Portal", url: EXAM_PLATFORM_URL }],
    ],
  };

  // ── /quiz or /quizzes command
  bot.command(["quiz", "quizzes"], async (ctx) => {
    await ctx.reply(examRedirectMsg, { parse_mode: "HTML", reply_markup: examKeyboard });
  });

  // ── Catch any leftover inline button taps from old chat sessions
  bot.action(/^tgquiz_/, async (ctx) => {
    try {
      await ctx.answerCbQuery("Chapter quizzes are no longer active.");
      await ctx.reply(examRedirectMsg, { parse_mode: "HTML", reply_markup: examKeyboard });
    } catch (_) {}
  });
}
