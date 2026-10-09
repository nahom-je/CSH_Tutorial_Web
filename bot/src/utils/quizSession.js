// src/utils/quizSession.js — In-memory quiz sessions for Telegram interactive quizzes

const activeSessions = new Map();

export function startQuizSession(userId, data) {
  const session = {
    userId,
    chapterId: data.chapterId,
    chapterTitle: data.chapterTitle,
    courseCode: data.courseCode,
    questions: data.questions || [],
    currentIndex: 0,
    score: 0,
    answers: {}, // { [index]: { chosen, isCorrect } }
    startedAt: Date.now(),
  };
  activeSessions.set(String(userId), session);
  return session;
}

export function getQuizSession(userId) {
  return activeSessions.get(String(userId)) || null;
}

export function endQuizSession(userId) {
  activeSessions.delete(String(userId));
}

export function recordQuizAnswer(userId, qIndex, chosenOption) {
  const session = getQuizSession(userId);
  if (!session) return null;

  const currentQ = session.questions[qIndex];
  if (!currentQ) return null;

  const isCorrect = String(chosenOption).toUpperCase() === String(currentQ.correct_option).toUpperCase();
  if (!session.answers[qIndex]) {
    session.answers[qIndex] = {
      chosen: chosenOption,
      isCorrect,
    };
    if (isCorrect) {
      session.score += 1;
    }
  }
  return {
    isCorrect,
    correctOption: currentQ.correct_option,
    explanation: currentQ.explanation,
    score: session.score,
    totalAnswered: Object.keys(session.answers).length,
  };
}
