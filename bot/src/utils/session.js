// src/utils/session.js — In-memory session store (per chat_id)
// Stores the wizard state for each user during the conversation flow.

const sessions = new Map();

export function getSession(chatId) {
  if (!sessions.has(chatId)) sessions.set(chatId, {});
  return sessions.get(chatId);
}

export function clearSession(chatId) {
  sessions.set(chatId, {});
}

export function setSession(chatId, data) {
  sessions.set(chatId, { ...(sessions.get(chatId) || {}), ...data });
}
