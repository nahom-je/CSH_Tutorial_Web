// src/handlers/quiz.js — Interactive Telegram Quiz Handler (Courses, Chapters, Questions, Explanations)
import { getQuizCourses, getQuizChapters, getQuizQuestions } from "../utils/quizApi.js";
import {
  startQuizSession,
  getQuizSession,
  recordQuizAnswer,
  endQuizSession,
} from "../utils/quizSession.js";
import { QUIZ_PLATFORM_URL } from "../../config.js";
import { escapeHtml } from "../utils/helpers.js";
import { logger } from "../utils/logger.js";
import { getOrdersByTelegramId } from "../db/database.js";

/**
 * Verify whether the user is an admin or has at least one approved order
 */
async function isApprovedStudent(ctx) {
  const adminId = process.env.ADMIN_CHAT_ID;
  const fromId = ctx.from?.id;
  const chatId = ctx.chat?.id;

  // Admin always has access
  if (adminId && (String(fromId) === String(adminId) || String(chatId) === String(adminId))) {
    return true;
  }

  const userId = fromId || chatId;
  if (!userId) return false;

  try {
    const orders = await getOrdersByTelegramId(userId);
    return orders.some((order) => order.status === "approved");
  } catch (err) {
    logger.error(`Error checking student approval status: ${err.message}`);
    return false;
  }
}

/**
 * Send access denied response when student is not approved yet
 */
async function replyAccessDenied(ctx) {
  const text =
    `🔒 <b>Quiz Access Locked</b>\n\n` +
    `Chapter quizzes are exclusively available to students with an approved CSH Tutorial subscription.\n\n` +
    `• If you haven't registered yet, tap /start to choose your plan and register.\n` +
    `• If you already submitted your payment screenshot, please wait for admin verification. You will receive full access immediately once approved!`;

  if (ctx.callbackQuery) {
    try {
      await ctx.answerCbQuery("Access restricted. Active subscription required.", { show_alert: true });
    } catch {
      // ignore
    }
    try {
      await ctx.editMessageText(text, { parse_mode: "HTML" });
    } catch {
      // ignore
    }
  } else {
    await ctx.reply(text, { parse_mode: "HTML" });
  }
}

const COURSE_ICONS = {
  "PHIL-1011": "🧠",
  "PSYC-1011": "🧬",
  "GEOG-1011": "🌍",
  "MATH-1011": "➕",
  "PHYS-1011": "⚡",
  "ENGL-1011": "📝",
  "ECON-1011": "📈",
};

/**
 * Format active question text and inline keyboard
 */
function renderQuestionView(session) {
  const { currentIndex, questions, chapterTitle, courseCode, score } = session;
  const q = questions[currentIndex];
  const total = questions.length;

  const optionsText = (q.options || [])
    .map((opt) => `<b>${escapeHtml(opt.id)})</b> ${escapeHtml(opt.text)}`)
    .join("\n\n");

  const text =
    `📚 <b>${escapeHtml(courseCode)}</b> — <i>${escapeHtml(chapterTitle)}</i>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `❓ <b>Question ${currentIndex + 1} of ${total}</b> ` +
    (q.difficulty ? `[<i>${escapeHtml(q.difficulty)}</i>]` : "") +
    `\n\n` +
    `${escapeHtml(q.question_text)}\n\n` +
    `${optionsText}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📊 <i>Score so far: ${score} / ${currentIndex}</i>\n` +
    `👇 <b>Tap your answer below:</b>`;

  // Option buttons in rows (A, B) and (C, D)
  const optionButtons = (q.options || []).map((opt) => ({
    text: `${opt.id}`,
    callback_data: `tgquiz_ans_${currentIndex}_${opt.id}`,
  }));

  const rows = [];
  for (let i = 0; i < optionButtons.length; i += 2) {
    rows.push(optionButtons.slice(i, i + 2));
  }
  rows.push([{ text: "⏹️ Exit Quiz", callback_data: "tgquiz_exit" }]);

  return { text, reply_markup: { inline_keyboard: rows } };
}

/**
 * Format answer feedback and explanation
 */
function renderAnswerFeedbackView(session, result) {
  const { currentIndex, questions, chapterTitle, courseCode, score } = session;
  const q = questions[currentIndex];
  const total = questions.length;
  const isLast = currentIndex + 1 >= total;

  const icon = result.isCorrect ? "✅" : "❌";
  const statusLine = result.isCorrect
    ? `✅ <b>CORRECT!</b> (Option ${escapeHtml(result.correctOption)})`
    : `❌ <b>INCORRECT!</b> The correct answer is <b>Option ${escapeHtml(result.correctOption)}</b>.`;

  const explanationText = q.explanation
    ? `\n\n💡 <b>Explanation:</b>\n${escapeHtml(q.explanation)}`
    : "";

  const text =
    `📚 <b>${escapeHtml(courseCode)}</b> — <i>${escapeHtml(chapterTitle)}</i>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `❓ <b>Question ${currentIndex + 1} of ${total}</b>\n\n` +
    `<b>Q:</b> ${escapeHtml(q.question_text)}\n\n` +
    `${statusLine}` +
    `${explanationText}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🎯 <b>Current Score: ${score} / ${currentIndex + 1}</b> (${Math.round((score / (currentIndex + 1)) * 100)}%)`;

  const actionButtons = [];
  if (isLast) {
    actionButtons.push([{ text: "🏁 View Final Results", callback_data: "tgquiz_finish" }]);
  } else {
    actionButtons.push([
      {
        text: `➡️ Next Question (${currentIndex + 2}/${total})`,
        callback_data: `tgquiz_next_${currentIndex + 1}`,
      },
    ]);
  }
  actionButtons.push([{ text: "⏹️ End Quiz Here", callback_data: "tgquiz_finish" }]);

  return { text, reply_markup: { inline_keyboard: actionButtons } };
}

export function registerQuizHandler(bot) {
  // ── /quiz or /quizzes command: Main Choice Menu
  bot.command(["quiz", "quizzes"], async (ctx) => {
    if (!(await isApprovedStudent(ctx))) {
      await replyAccessDenied(ctx);
      return;
    }

    const text =
      `📝 <b>CSH Tutorial Chapter Quizzes</b>\n\n` +
      `Master your freshman subjects with <b>1,185 authentic university questions</b>, instant answer feedback, and step-by-step explanations!\n\n` +
      `<b>Where would you like to practice?</b>\n` +
      `• <b>Telegram Bot:</b> Practice right here in chat with instant buttons.\n` +
      `• <b>Web Platform:</b> Practice on full interactive web interface.`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: "🤖 Practice in Telegram", callback_data: "tgquiz_menu_bot" },
        ],
        [
          { text: "🌐 Practice on Web Platform", callback_data: "tgquiz_menu_web" },
        ],
      ],
    };

    await ctx.reply(text, { parse_mode: "HTML", reply_markup: keyboard });
  });

  // ── Launch fresh quiz menu from delivery message (keeps channel link intact above)
  bot.action("tgquiz_launch_fresh", async (ctx) => {
    await ctx.answerCbQuery();
    if (!(await isApprovedStudent(ctx))) {
      await replyAccessDenied(ctx);
      return;
    }

    const text =
      `📝 <b>CSH Tutorial Chapter Quizzes</b>\n\n` +
      `Master your freshman subjects with <b>1,185 authentic university questions</b>, instant answer feedback, and step-by-step explanations!\n\n` +
      `<b>Where would you like to practice?</b>\n` +
      `• <b>Telegram Bot:</b> Practice right here in chat with interactive buttons.\n` +
      `• <b>Web Platform:</b> Practice on full interactive web interface.`;

    const keyboard = {
      inline_keyboard: [
        [{ text: "🤖 Practice in Telegram", callback_data: "tgquiz_menu_bot" }],
        [{ text: "🌐 Practice on Web Platform", callback_data: "tgquiz_menu_web" }],
      ],
    };

    await ctx.reply(text, { parse_mode: "HTML", reply_markup: keyboard });
  });


  // ── Menu: Choose Web
  bot.action("tgquiz_menu_web", async (ctx) => {
    await ctx.answerCbQuery();
    if (!(await isApprovedStudent(ctx))) {
      await replyAccessDenied(ctx);
      return;
    }

    const isLocal = QUIZ_PLATFORM_URL.includes("localhost") || QUIZ_PLATFORM_URL.includes("127.0.0.1");

    const replyMarkup = isLocal
      ? {
          inline_keyboard: [
            [{ text: "🤖 Practice in Telegram Instead", callback_data: "tgquiz_menu_bot" }],
          ],
        }
      : {
          inline_keyboard: [
            [{ text: "🚀 Open Web Quizzes", url: QUIZ_PLATFORM_URL }],
            [{ text: "🤖 Practice in Telegram", callback_data: "tgquiz_menu_bot" }],
          ],
        };

    const text =
      `🌐 <b>CSH Tutorial Web Quiz Platform</b>\n\n` +
      `Take full chapter quizzes with analytics and answer reviews on our website:\n\n` +
      `👉 <b>Web URL:</b> <a href="${QUIZ_PLATFORM_URL}">${QUIZ_PLATFORM_URL}</a>\n\n` +
      `💡 <i>Tip: You can unlock quizzes on the website using your Telegram Order Code (e.g. NT-1001).</i>`;

    await ctx.editMessageText(text, { parse_mode: "HTML", reply_markup: replyMarkup });
  });

  // ── Menu: Choose Bot Quizzes → Show Course Catalog
  bot.action(["tgquiz_menu_bot", "tgquiz_courses"], async (ctx) => {
    await ctx.answerCbQuery("Loading courses...");
    if (!(await isApprovedStudent(ctx))) {
      await replyAccessDenied(ctx);
      return;
    }
    const courses = await getQuizCourses();

    if (!courses.length) {
      await ctx.editMessageText(
        "⚠️ Could not load courses at this moment. Please try again shortly.",
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔄 Retry", callback_data: "tgquiz_menu_bot" }],
            ],
          },
        }
      );
      return;
    }

    const buttons = courses.map((c) => {
      const icon = COURSE_ICONS[c.code] || "📚";
      return [
        {
          text: `${icon} ${c.title} (${c.code})`,
          callback_data: `tgquiz_course_${c.id}`,
        },
      ];
    });

    buttons.push([{ text: "🔙 Back", callback_data: "tgquiz_back_choice" }]);

    const text =
      `📚 <b>Select a Course to Practice:</b>\n\n` +
      `Choose any freshman course below to view its chapter quizzes:`;

    await ctx.editMessageText(text, {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: buttons },
    });
  });

  // ── Back to choice menu
  bot.action("tgquiz_back_choice", async (ctx) => {
    await ctx.answerCbQuery();
    const text =
      `📝 <b>CSH Tutorial Chapter Quizzes</b>\n\n` +
      `Where would you like to practice?`;

    const keyboard = {
      inline_keyboard: [
        [{ text: "🤖 Practice in Telegram", callback_data: "tgquiz_menu_bot" }],
        [{ text: "🌐 Practice on Web Platform", callback_data: "tgquiz_menu_web" }],
      ],
    };
    await ctx.editMessageText(text, { parse_mode: "HTML", reply_markup: keyboard });
  });

  // ── Course selected → Show Chapters
  bot.action(/^tgquiz_course_(.+)$/, async (ctx) => {
    await ctx.answerCbQuery("Loading chapters...");
    if (!(await isApprovedStudent(ctx))) {
      await replyAccessDenied(ctx);
      return;
    }
    const courseId = ctx.match[1];
    const courses = await getQuizCourses();
    const course = courses.find((c) => c.id === courseId);
    const courseCode = course ? course.code : "Course";

    const chapters = await getQuizChapters(courseId);

    // If English Grammar (Single Quiz)
    if (courseCode === "ENGL-1011" && chapters.length === 1) {
      const ch = chapters[0];
      const text =
        `📝 <b>English Grammar (ENGL-1011)</b>\n\n` +
        `Comprehensive 45-question diagnostic & practice exam covering all essential university freshman grammar topics.\n\n` +
        `Ready to start?`;

      const keyboard = {
        inline_keyboard: [
          [{ text: "🚀 Start English Quiz (45 Qs)", callback_data: `tgquiz_start_${ch.id}` }],
          [{ text: "🔙 Back to Courses", callback_data: "tgquiz_courses" }],
        ],
      };
      await ctx.editMessageText(text, { parse_mode: "HTML", reply_markup: keyboard });
      return;
    }

    if (!chapters.length) {
      await ctx.editMessageText(`⚠️ No chapters found for this course.`, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [[{ text: "🔙 Back to Courses", callback_data: "tgquiz_courses" }]],
        },
      });
      return;
    }

    const buttons = chapters.map((ch) => [
      {
        text: `📖 Ch ${ch.chapter_number}: ${ch.title}`,
        callback_data: `tgquiz_start_${ch.id}`,
      },
    ]);

    buttons.push([{ text: "🔙 Back to Courses", callback_data: "tgquiz_courses" }]);

    const text =
      `📖 <b>${escapeHtml(course?.title || courseCode)}</b>\n\n` +
      `Select a chapter to begin practicing:`;

    await ctx.editMessageText(text, {
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: buttons },
    });
  });

  // ── Start Chapter Quiz
  bot.action(/^tgquiz_start_(.+)$/, async (ctx) => {
    await ctx.answerCbQuery("Loading questions...");
    if (!(await isApprovedStudent(ctx))) {
      await replyAccessDenied(ctx);
      return;
    }
    const chapterId = ctx.match[1];
    const userId = ctx.from.id;

    const questions = await getQuizQuestions(chapterId);
    if (!questions.length) {
      await ctx.reply("⚠️ No questions found for this chapter.");
      return;
    }

    // Find chapter info
    const courses = await getQuizCourses();
    let chapterTitle = "Chapter Quiz";
    let courseCode = "CSH";

    for (const c of courses) {
      const chs = await getQuizChapters(c.id);
      const found = chs.find((ch) => ch.id === chapterId);
      if (found) {
        chapterTitle = `Chapter ${found.chapter_number}: ${found.title}`;
        courseCode = c.code;
        break;
      }
    }

    // Start in-memory session
    const session = startQuizSession(userId, {
      chapterId,
      chapterTitle,
      courseCode,
      questions,
    });

    const view = renderQuestionView(session);
    await ctx.editMessageText(view.text, {
      parse_mode: "HTML",
      reply_markup: view.reply_markup,
    });
  });

  // ── User answered question: tgquiz_ans_<index>_<option>
  bot.action(/^tgquiz_ans_(\d+)_(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();
    const qIndex = parseInt(ctx.match[1], 10);
    const chosenOption = ctx.match[2];
    const userId = ctx.from.id;

    const session = getQuizSession(userId);
    if (!session || session.currentIndex !== qIndex) {
      await ctx.answerCbQuery("Session expired or question already answered.");
      return;
    }

    const result = recordQuizAnswer(userId, qIndex, chosenOption);
    if (!result) return;

    const view = renderAnswerFeedbackView(session, result);
    await ctx.editMessageText(view.text, {
      parse_mode: "HTML",
      reply_markup: view.reply_markup,
    });
  });

  // ── Next question: tgquiz_next_<nextIndex>
  bot.action(/^tgquiz_next_(\d+)$/, async (ctx) => {
    await ctx.answerCbQuery();
    const nextIndex = parseInt(ctx.match[1], 10);
    const userId = ctx.from.id;

    const session = getQuizSession(userId);
    if (!session) {
      await ctx.editMessageText("Quiz session ended. Type /quiz to start again.", {
        parse_mode: "HTML",
      });
      return;
    }

    session.currentIndex = nextIndex;
    const view = renderQuestionView(session);
    await ctx.editMessageText(view.text, {
      parse_mode: "HTML",
      reply_markup: view.reply_markup,
    });
  });

  // ── Finish Quiz: tgquiz_finish
  bot.action("tgquiz_finish", async (ctx) => {
    await ctx.answerCbQuery("Calculating results...");
    const userId = ctx.from.id;
    const session = getQuizSession(userId);

    if (!session) {
      await ctx.editMessageText("Quiz finished. Type /quiz to take another quiz!", {
        parse_mode: "HTML",
      });
      return;
    }

    const { score, questions, chapterTitle, courseCode } = session;
    const totalAnswered = Object.keys(session.answers).length || 1;
    const totalQuestions = questions.length;
    const percent = Math.round((score / totalAnswered) * 100);

    let trophy = "🌟 Good Effort!";
    if (percent >= 90) trophy = "🏆 Outstanding Mastery! (A+)";
    else if (percent >= 75) trophy = "🎉 Great Work! (B+)";
    else if (percent >= 50) trophy = "👍 Passing Grade — Keep Reviewing!";

    const text =
      `🎉 <b>Quiz Completed!</b>\n` +
      `📚 <b>${escapeHtml(courseCode)}</b> — <i>${escapeHtml(chapterTitle)}</i>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🎯 <b>Score: ${score} / ${totalAnswered}</b> (${percent}%)\n` +
      `📝 Total Chapter Questions: ${totalQuestions}\n` +
      `🎖️ <b>Result:</b> ${trophy}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `Would you like to practice another chapter?`;

    const keyboard = {
      inline_keyboard: [
        [{ text: "🔄 Retake This Chapter", callback_data: `tgquiz_start_${session.chapterId}` }],
        [{ text: "📚 Choose Another Chapter", callback_data: "tgquiz_courses" }],
        [{ text: "🏠 Main Menu", callback_data: "tgquiz_back_choice" }],
      ],
    };

    endQuizSession(userId);
    await ctx.editMessageText(text, { parse_mode: "HTML", reply_markup: keyboard });
  });

  // ── Exit Quiz
  bot.action("tgquiz_exit", async (ctx) => {
    await ctx.answerCbQuery("Quiz cancelled.");
    const userId = ctx.from.id;
    endQuizSession(userId);

    await ctx.editMessageText(
      `⏹️ <b>Quiz Exited</b>\n\nYou can restart or choose another chapter whenever you are ready!`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📚 Browse Quizzes", callback_data: "tgquiz_courses" }],
            [{ text: "🏠 Main Menu", callback_data: "tgquiz_back_choice" }],
          ],
        },
      }
    );
  });
}
