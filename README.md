# 🚀 CSH Tutorial (NeXT-TeCH Freshman Hub)

> A full-stack e-learning enrollment and digital delivery platform built for Jimma University (JU) freshmen. Combines a modern React landing page with an automated Telegram registration & order-fulfillment bot.

---

## 📖 Documentation Index

- 📘 **[Full Architecture & System Documentation (PROJECT_DOCUMENTATION.md)](file:///c:/Users/Hp/Desktop/Full-Stack-Dev/React-Js/Client-01/next-tech-hub/PROJECT_DOCUMENTATION.md)**: Deep technical breakdown of every component, codeflow, database schema, state machine, security model, and API.
- 🚀 **[Setup & Deployment Guide (DEPLOY.md)](file:///c:/Users/Hp/Desktop/Full-Stack-Dev/React-Js/Client-01/next-tech-hub/DEPLOY.md)**: Step-by-step instructions for hosting the bot on Render / VPS (PM2) and the frontend on Vercel / Netlify.

---

## 🌟 Key Features

- **Marketing Landing Page**: Built with React 19 and Vite. Features stream switching (Natural vs Social Science), curriculum overview, transparent pricing, and interactive modals.
- **Automated Telegram Bot**: Built with Node.js and Telegraf. Drives a conversational wizard to register students, assign order IDs (`NT-XXXX`), and present banking instructions.
- **Zero-Dependency Database**: WebAssembly-powered SQLite via `sql.js` with atomic file flushing and automatic corruption recovery.
- **Ethiopian Payment Integration**: Supports TeleBirr and Commercial Bank of Ethiopia (CBE) manual transfer verification.
- **Automated Channel Delivery**: Generates single-use private channel invite links upon admin approval.
- **Admin Command Center**: Real-time admin notifications, stats tracking, and quick `/approve`, `/reject`, and `/resend` commands.

---

## ⚡ Quick Start

### 1. Telegram Bot

```bash
cd bot
npm install
copy .env.example .env     # On Windows (use cp on Linux/macOS)
# Configure your BOT_TOKEN, ADMIN_CHAT_ID, and payment details in .env
npm run dev
```

### 2. Frontend Landing Page

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to view the web application.

---

## 📁 Repository Structure

```
next-tech-hub/
├── bot/                         # Node.js Telegram bot (runs 24/7)
│   ├── src/                     # Core bot handlers, DB layer, and helpers
│   ├── data/                    # SQLite database storage (orders.db)
│   └── config.js                # Pricing and channel settings
├── frontend/                    # React 19 + Vite static web application
│   ├── src/                     # React components and styling
│   └── public/                  # Static assets
├── PROJECT_DOCUMENTATION.md     # In-depth architectural & operational guide
├── DEPLOY.md                    # Complete production deployment runbook
└── render.yaml                  # Render service configuration
```
