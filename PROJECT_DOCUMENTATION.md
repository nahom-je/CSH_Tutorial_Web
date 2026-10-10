# 📚 CSH Tutorial (NeXT-TeCH Freshman Hub) — Comprehensive System Documentation

> **Complete architectural, operational, codebase, and deployment reference guide.**  
> *Targeted for developers, system administrators, and project maintainers.*

---

## 📑 Table of Contents

1. [Executive Summary & Purpose](#1-executive-summary--purpose)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Repository File & Directory Structure](#3-repository-file--directory-structure)
4. [Frontend Architecture (React + Vite)](#4-frontend-architecture-react--vite)
   - [Tech Stack & Design Philosophy](#tech-stack--design-philosophy)
   - [Component Hierarchy & Responsibilities](#component-hierarchy--responsibilities)
   - [Course Data Model & Stream Filtering](#course-data-model--stream-filtering)
   - [Telegram Deep-Linking Integration](#telegram-deep-linking-integration)
5. [Telegram Bot Architecture (Node.js + Telegraf)](#5-telegram-bot-architecture-nodejs--telegraf)
   - [Core Technologies & Bot Configuration](#core-technologies--bot-configuration)
   - [Wizard Flow & Finite State Machine](#wizard-flow--finite-state-machine)
   - [In-Memory Session Management](#in-memory-session-management)
   - [Health Check & Keep-Alive HTTP Server](#health-check--keep-alive-http-server)
6. [Database Engine & Data Layer (sql.js)](#6-database-engine--data-layer-sqljs)
   - [Why WASM SQLite?](#why-wasm-sqlite)
   - [Schema Definition (DDL)](#schema-definition-ddl)
   - [Atomic Persistence & Corruption Recovery](#atomic-persistence--corruption-recovery)
   - [Sequential Order Code Generation](#sequential-order-code-generation)
7. [End-to-End Order & Payment Lifecycle](#7-end-to-end-order--payment-lifecycle)
   - [Phase 1: Student Onboarding & Selection](#phase-1-student-onboarding--selection)
   - [Phase 2: Order Generation & Payment Instructions](#phase-2-order-generation--payment-instructions)
   - [Phase 3: Proof of Payment Submission](#phase-3-proof-of-payment-submission)
   - [Phase 4: Admin Review & Channel Access Delivery](#phase-4-admin-review--channel-access-delivery)
8. [Admin Command Center & Operations](#8-admin-command-center--operations)
   - [Access Control & Authorization](#access-control--authorization)
   - [Command Reference Guide](#command-reference-guide)
   - [Inline Interactive Action Callbacks](#inline-interactive-action-callbacks)
9. [Configuration & Environment Variables](#9-configuration--environment-variables)
   - [Bot Environment Variables (`bot/.env`)](#bot-environment-variables-botenv)
   - [Central Bot Settings (`bot/config.js`)](#central-bot-settings-botconfigjs)
   - [Frontend Configuration (`frontend/src/data/courses.js`)](#frontend-configuration-frontendsrcdatacoursesjs)
10. [Local Development Setup](#10-local-development-setup)
    - [Prerequisites](#prerequisites)
    - [Bot Setup & Startup](#bot-setup--startup)
    - [Frontend Setup & Startup](#frontend-setup--startup)
11. [Production Deployment Architecture](#11-production-deployment-architecture)
    - [Bot on Render (Free Web Service)](#bot-on-render-free-web-service)
    - [Bot on VPS with PM2](#bot-on-vps-with-pm2)
    - [Frontend on Vercel or Netlify](#frontend-on-vercel-or-netlify)
12. [Security, Fraud Prevention & Error Handling](#12-security-fraud-prevention--error-handling)
13. [Troubleshooting & Maintenance Playbook](#13-troubleshooting--maintenance-playbook)

---

## 1. Executive Summary & Purpose

**CSH Tutorial** (also identified as **NeXT-TeCH Freshman Hub**) is an end-to-end e-learning enrollment and digital content distribution platform tailored specifically for higher-education freshmen in Ethiopia, centered around the **Jimma University (JU)** curriculum.

### The Problem It Solves
First-year university students in Ethiopia face a steep learning curve adapting to English-medium tertiary courses (e.g., Mathematics for Natural/Social Sciences, General Physics, Economics, Critical Thinking). High-quality digital support materials are often scattered, unreliable, or behind expensive international payment gateways inaccessible to students using domestic Ethiopian banking.

### The Solution
A hybrid web-and-chat enrollment system:
1. **Marketing & Curriculum Showcase**: A responsive, modern React landing page displaying course syllabi for Natural and Social Science streams, pricing plans, and FAQs.
2. **Frictionless Purchase Flow**: Deep-linking from web CTA buttons directly into Telegram (`@CSH_Tutorial_bot`).
3. **Automated Order Registration**: A multi-step conversational wizard that validates student identity, issues a unique order identifier (`NT-XXXX`), and provides precise payment instructions.
4. **Domestic Payment Verification**: Accepts Ethiopian payment mechanisms (**TeleBirr** and **Commercial Bank of Ethiopia - CBE**), handled via screenshot submission and admin verification.
5. **Channel Access Delivery**: Upon admin approval, the bot automatically sends single-use private channel invites and course resources to the student.

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           STUDENT BROWSER                               │
│  React 19 + Vite Landing Page (Hosted on Vercel / Netlify / Static Host)│
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                     Deep-link CTA (t.me/CSH_Tutorial_bot?start=sem1)
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        TELEGRAM ECOSYSTEM                               │
│                                                                         │
│  ┌───────────────────────┐            ┌───────────────────────────────┐ │
│  │     Student Chat      │            │       Admin Dashboard         │ │
│  │ (@CSH_Tutorial_bot)   │            │     (Private Admin Chat)      │ │
│  └───────────▲───────────┘            └───────────────▲───────────────┘ │
└──────────────┼────────────────────────────────────────┼─────────────────┘
               │ Long Polling (Telegraf)                │ Notifications
               ▼                                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    NODE.JS APPLICATION SERVER                           │
│  (Hosted on Render Web Service or VPS managed via PM2)                 │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ HTTP Health Server (:3000)                                        │  │
│  │ Returns JSON status for Render keep-alive & uptime monitors       │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Telegraf Middleware & Handlers Pipeline                           │  │
│  │  1. start.js      -> /start deep-link parsing                     │  │
│  │  2. admin.js      -> /pending, /approve, /reject, /stats, /find   │  │
│  │  3. screenshot.js -> "I've sent the screenshot" callback          │  │
│  │  4. wizard.js     -> Step-by-step registration conversation       │  │
│  └──────────────────────────────────┬────────────────────────────────┘  │
│                                     │                                   │
│  ┌──────────────────────────────────▼────────────────────────────────┐  │
│  │ Data & Storage Layer                                              │  │
│  │  • Session Store (In-Memory Map keyed by Telegram chatId)         │  │
│  │  • sql.js Database Engine (Pure WebAssembly SQLite)               │  │
│  │  • Atomic File Flushing: Memory -> orders.db.tmp -> orders.db    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Repository File & Directory Structure

The repository is structured as a monorepo containing two main subprojects: `bot` and `frontend`.

```
Client-01/
└── next-tech-hub/
    ├── .git/                      # Git version control directory
    ├── .gitignore                 # Root git ignore (node_modules, logs, .env)
    ├── DEPLOY.md                  # Detailed deployment guide & operational runbook
    ├── PROJECT_DOCUMENTATION.md   # [This Document] Full system architecture & code docs
    ├── README.md                  # Project intro and quick references
    ├── render.yaml                # Render Blueprint deployment configuration
    │
    ├── bot/                       # Telegram Bot backend application
    │   ├── .env                   # Active environment variables (git-ignored)
    │   ├── .env.example           # Template for required environment configuration
    │   ├── .gitignore             # Bot specific git ignore rules
    │   ├── .npmrc                 # NPM engine and package resolution settings
    │   ├── config.js              # Central pricing, channels, and business rules
    │   ├── ecosystem.config.cjs   # PM2 process management config for VPS hosting
    │   ├── package.json           # Bot dependencies & scripts
    │   ├── package-lock.json      # Locked dependency tree
    │   ├── render.yaml            # Render Web Service definition
    │   ├── data/                  # SQLite storage directory (auto-created)
    │   │   └── orders.db          # Binary SQLite database file
    │   ├── logs/                  # System log storage directory
    │   │   └── app.log            # Timestamped file logs
    │   └── src/
    │       ├── bot.js             # Main entry point & Telegraf coordinator
    │       ├── db/
    │       │   └── database.js    # sql.js wrapper, DDL schema, CRUD operations
    │       ├── handlers/
    │       │   ├── admin.js       # Admin commands, callbacks & access management
    │       │   ├── screenshot.js  # Payment confirmation callback handler
    │       │   ├── start.js       # /start and /cancel command handlers
    │       │   └── wizard.js      # Student registration text & callback wizard
    │       └── utils/
    │           ├── delivery.js    # Channel invite generation & message dispatcher
    │           ├── helpers.js     # Keyboards, string validators & HTML formatters
    │           ├── logger.js      # Dual console + file logging utility
    │           └── session.js     # In-memory per-user session manager
    │
    └── frontend/                  # React + Vite static landing page
        ├── .gitignore             # Frontend git ignore rules
        ├── .oxlintrc.json         # Oxlint linter configuration
        ├── index.html             # HTML5 entry template with SEO meta tags
        ├── package.json           # Frontend dependencies & build scripts
        ├── package-lock.json      # Locked dependency tree
        ├── vite.config.js         # Vite configuration with React plugin
        ├── dist/                  # Production build output (after `npm run build`)
        ├── public/                # Static public assets (favicons, robots.txt)
        └── src/
            ├── App.css            # Component-specific animation and overrides
            ├── App.jsx            # Main app composition & semantic container
            ├── index.css          # Design system, CSS variables & responsive layout
            ├── main.jsx           # React DOM root entry point
            ├── assets/
            │   └── LOGO.jpg       # Brand logo
            ├── components/
            │   ├── Benefits.jsx   # Value proposition cards
            │   ├── Courses.jsx    # Interactive course catalogue & stream filter
            │   ├── FAQ.jsx        # Accordion-style frequently asked questions
            │   ├── Footer.jsx     # Navigation links, contact info & copyright
            │   ├── Hero.jsx       # Hero header, CTA buttons & quick stats
            │   ├── HowItWorks.jsx # 4-step registration workflow explanation
            │   ├── Navbar.jsx     # Sticky navigation with mobile hamburger drawer
            │   ├── PaymentMethods.jsx # Supported domestic payment options
            │   └── Pricing.jsx    # Pricing tiers, feature checklists & modal alerts
            └── data/
                └── courses.js     # Single source of truth for course listings & prices
```

---

## 4. Frontend Architecture (React + Vite)

### Tech Stack & Design Philosophy
- **Framework**: React 19 (`^19.2.8`)
- **Build Tool**: Vite 8 (`^8.3.0`)
- **Styling**: Pure Vanilla CSS (`index.css` & `App.css`) using CSS custom properties (variables), Flexbox, CSS Grid, glassmorphism, and hardware-accelerated animations. No heavy utility frameworks like Tailwind are required.
- **Design Tokens**:
  - Primary color palette: Deep navy slate backgrounds, vibrant indigo/blue accents (`#2563EB`, `#1D4ED8`), high-contrast accessible typography.
  - Cards: Soft gradient borders, backdrop blur, subtle hover transformations.
  - Mobile responsiveness: Mobile-first responsive breakpoints at `768px` and `1024px`.

### Component Hierarchy & Responsibilities

```
App.jsx
 ├── a.skip-link (Accessibility skip to main content)
 ├── Navbar.jsx
 │    ├── Logo & Brand Title
 │    ├── Desktop Links
 │    ├── Mobile Hamburger Button & Drawer
 │    └── "Get Access" Action CTA
 └── <main id="main-content">
      ├── Hero.jsx            (Headline, dynamic badges, CTA, stats bar)
      ├── Benefits.jsx        (4 key value propositions)
      ├── Courses.jsx         (Stream switcher [Natural vs Social], Course cards)
      ├── Pricing.jsx         (Semester 1, Full Year, Semester 2 cards, inactive plan modal)
      ├── HowItWorks.jsx      (4-step visual onboarding guide)
      ├── PaymentMethods.jsx  (TeleBirr & CBE security notice)
      └── FAQ.jsx             (Collapsible accordion Q&A)
 └── Footer.jsx               (Brand info, directory links, direct contact)
```

### Course Data Model & Stream Filtering
Defined in [frontend/src/data/courses.js](file:///c:/Users/Hp/Desktop/Full-Stack-Dev/React-Js/Client-01/next-tech-hub/frontend/src/data/courses.js):

- **Price Constants**:
  - `SEM_PRICE`: `399` ETB
  - `FULL_YEAR_PRICE`: `699` ETB (Save ~100 ETB discount)
- **Target Telegram Bot**:
  - `BOT_USERNAME`: `"CSH_Tutorial_bot"`
- **Streams Provided**:
  1. `sem1Natural` (7 courses): Mathematics for Natural Sciences, General Physics, Communicative English I, General Psychology, Critical Thinking, Geography of Ethiopia and the Horn, Physical Fitness.
  2. `sem1Social` (7 courses): General Economics, Mathematics for Social Science, Communicative English 1, Geography, Logic and Critical Thinking, General Psychology, Physical Fitness.
  3. `sem2` (8 courses): Communicative English II, Social Anthropology, Applied Mathematics I, Entrepreneurship, Emerging Technologies, Moral and Civic Education, Computer Programming, History of Ethiopia and the Horn.

In [Courses.jsx](file:///c:/Users/Hp/Desktop/Full-Stack-Dev/React-Js/Client-01/next-tech-hub/frontend/src/components/Courses.jsx), an interactive state toggle `stream` (`"natural"` | `"social"`) allows students to dynamically switch between streams without reloading the page.

### Telegram Deep-Linking Integration
The landing page does not process credit cards or sensitive student passwords directly. Instead, all primary CTA buttons generate Telegram deep-links:

```javascript
href={`https://t.me/${BOT_USERNAME}?start=${plan.id}`}
```

- When clicked, Telegram opens the chat with `@CSH_Tutorial_bot` and sends `/start sem1` or `/start full`.
- For unavailable plans (such as Semester 2 or Full Year), [Pricing.jsx](file:///c:/Users/Hp/Desktop/Full-Stack-Dev/React-Js/Client-01/next-tech-hub/frontend/src/components/Pricing.jsx) intercepts the click with an interactive popup dialog explaining that only **Semester 1** is active, guiding the user to the active plan.

---

## 5. Telegram Bot Architecture (Node.js + Telegraf)

### Core Technologies & Bot Configuration
- **Runtime**: Node.js 18+ (ES Modules: `"type": "module"`)
- **Bot Framework**: Telegraf 4 (`telegraf: ^4.16.3`) using HTTP Long Polling (`bot.launch()`).
- **Database Engine**: `sql.js` (SQLite compiled to WebAssembly).
- **Process Manager**: PM2 (optional for VPS) or Render native process supervisor.

### Wizard Flow & Finite State Machine

The registration bot acts as a finite state machine tracking user progress through sessions:

```
[User starts bot]
        │
        ▼
   /start [plan]
        │
        ▼
 ┌───────────────┐
 │   ask_name    │  <-- Expects text (>= 3 chars)
 └───────┬───────┘
         │ Name validated
         ▼
 ┌──────────────────────┐
 │ Does user have TG    │─── Yes ──► ┌──────────────────────┐
 │ username in profile? │            │  confirm_username    │
 └──────────┬───────────┘            │  "Is this @handle?"  │
            No                       └──────────┬───────────┘
            │                                   │ Yes / No
            ▼                                   ▼
 ┌──────────────────────┐            ┌──────────────────────┐
 │    ask_username      │◄───────────│ "No" / Enter manual  │
 │  Enter @your_handle  │            └──────────────────────┘
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │      ask_field       │  <-- Inline Buttons: [📚 Social] or [🔬 Natural]
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │    choose_method     │  <-- Shows order summary & prices.
 └──────────┬───────────┘      Inline Buttons: [📱 TeleBirr] or [🏦 CBE]
            │
            ▼
 ┌──────────────────────┐
 │  Order Created!      │  <-- Inserts into SQLite. Generates code NT-XXXX.
 │  awaiting_screenshot │      Shows Account Holder & Account Number.
 └──────────┬───────────┘
            │
            ▼
  Student pays via Banking App
            │
            ▼
  Student clicks "✅ I've sent the screenshot"
            │
            ▼
 ┌──────────────────────┐
 │   screenshot_sent    │  <-- Notifies Admin with Approve/Reject inline buttons.
 └──────────────────────┘
```

### In-Memory Session Management
Defined in [bot/src/utils/session.js](file:///c:/Users/Hp/Desktop/Full-Stack-Dev/React-Js/Client-01/next-tech-hub/bot/src/utils/session.js):
- Uses a Javascript `Map` where keys are numeric Telegram `chatId`s.
- `getSession(chatId)`: Retrieves or initializes the active state object.
- `setSession(chatId, data)`: Shallow merges updates into the user's active session.
- `clearSession(chatId)`: Resets the state back to `{}` upon completion or `/cancel`.

### Health Check & Keep-Alive HTTP Server
Render free-tier Web Services and external uptime pingers require an open HTTP port. Inside [bot/src/bot.js](file:///c:/Users/Hp/Desktop/Full-Stack-Dev/React-Js/Client-01/next-tech-hub/bot/src/bot.js):

```javascript
const PORT = process.env.PORT || 3000;
server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    status: "ok",
    bot: `@${botInfo.username}`,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  }));
});
server.listen(PORT);
```
This serves a lightweight HTTP endpoint allowing services like [UptimeRobot](https://uptimerobot.com) to ping the bot every 5–10 minutes to prevent container sleep.

---

## 6. Database Engine & Data Layer (sql.js)

### Why WASM SQLite?
Traditional Node.js SQLite drivers (`better-sqlite3`, `sqlite3`) rely on node-gyp and native C++ compilers (`gcc`, `g++`, Python). This often causes compilation failures across disparate developer machines (e.g. Windows vs Linux) and container build environments.

CSH Tutorial uses **`sql.js`** (`sql.js: ^1.14.2`):
- SQLite compiled directly into WebAssembly.
- 100% pure JavaScript/WASM with zero external system compiler dependencies.
- Runs identically on Windows, macOS, Linux, and cloud containers.

### Schema Definition (DDL)
Managed in [bot/src/db/database.js](file:///c:/Users/Hp/Desktop/Full-Stack-Dev/React-Js/Client-01/next-tech-hub/bot/src/db/database.js):

```sql
CREATE TABLE IF NOT EXISTS orders (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  order_code        TEXT    UNIQUE NOT NULL,
  telegram_id       INTEGER NOT NULL,
  telegram_username TEXT,
  name              TEXT    NOT NULL,
  department        TEXT    NOT NULL,
  phone             TEXT    NOT NULL,
  plan              TEXT    NOT NULL,
  price             INTEGER NOT NULL,
  method            TEXT    NOT NULL,
  status            TEXT    NOT NULL DEFAULT 'awaiting_payment',
  reject_reason     TEXT,
  created_at        TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at       TEXT
);

CREATE TABLE IF NOT EXISTS counters (
  key   TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO counters(key, value)
VALUES ('order_seq', 1000);
```

### Atomic Persistence & Corruption Recovery
Because `sql.js` operates primarily in memory, database changes must be flushed to the file system. To guarantee data integrity during crashes or abrupt power outages, the database writes atomically:

1. `db.export()` serializes SQLite memory into a binary `Uint8Array`.
2. Data is written to a temporary staging file: `orders.db.tmp`.
3. An atomic file system rename overwrites `orders.db` via `fs.renameSync(DB_TMP, DB_PATH)`.
4. If an existing `orders.db` is corrupt upon startup, `getDb()` catches the initialization error, renames the corrupt file to `orders.db.corrupt.<timestamp>`, and initializes a fresh database to keep the bot operational.

### Sequential Order Code Generation
Instead of exposing raw internal SQLite database row IDs, human-readable codes are generated:
- Format: `NT-XXXX` (e.g., `NT-1001`, `NT-1002`).
- Tracked atomically via the `counters` table under `key = 'order_seq'`.

---

## 7. End-to-End Order & Payment Lifecycle

### Phase 1: Student Onboarding & Selection
1. Student clicks a CTA link from the landing page: `https://t.me/CSH_Tutorial_bot?start=sem1`.
2. The bot parses deep-link parameters in [start.js](file:///c:/Users/Hp/Desktop/Full-Stack-Dev/React-Js/Client-01/next-tech-hub/bot/src/handlers/start.js). If `full` or `sem2` are passed, the bot automatically advises the student that only **Semester 1** is active.
3. The student selects the **Semester 1** inline button.
4. The bot prompts for the student's **Full Name** (must be $\ge 3$ characters).
5. The bot inspects `ctx.from.username`. If present, it asks: *"Is this your Telegram username: @username?"* with `[Yes, continue]` or `[No, enter username]`. If absent, it requests manual input.
6. The bot asks for the student's stream: `[📚 Social]` or `[🔬 Natural]`.

### Phase 2: Order Generation & Payment Instructions
1. Guard check: The bot verifies that the student does not have $\ge 3$ open orders (`getOpenOrderCount`).
2. An order record is inserted into SQLite with status `'awaiting_payment'`.
3. Order code `NT-XXXX` is generated.
4. The bot presents the student with the payment instructions:
   - Selected method: **TeleBirr** (`process.env.TELEBIRR_NUMBER`) or **CBE** (`process.env.CBE_ACCOUNT`).
   - Account Holder: `process.env.ACCOUNT_HOLDER_NAME`.
   - Exact price: `399 ETB`.
   - Security Notice: Explicit warning never to transfer funds to any other name.

### Phase 3: Proof of Payment Submission
1. The student makes the bank/mobile transfer through their banking app.
2. The bot instructs the student to forward their transfer receipt/screenshot to the admin: `@Umeribnukedir`.
3. The student taps the bot button: `[✅ I've sent the screenshot]`.
4. The order status updates from `'awaiting_payment'` to `'screenshot_sent'`.
5. The bot triggers an immediate alert directly to `process.env.ADMIN_CHAT_ID`.

### Phase 4: Admin Review & Channel Access Delivery
1. The admin receives a notification containing the student's order details along with two inline buttons: `[✅ Approve]` and `[❌ Reject]`.
2. **If Approved**:
   - Status updates to `'approved'` and timestamp `reviewed_at` is set.
   - [delivery.js](file:///c:/Users/Hp/Desktop/Full-Stack-Dev/React-Js/Client-01/next-tech-hub/bot/src/utils/delivery.js) triggers `deliverAccess()`.
   - The bot attempts to generate a single-use private channel invite link via `bot.telegram.createChatInviteLink()` with `member_limit: 1` and 48-hour expiration.
   - If dynamic generation fails, it falls back to the configured channel link.
   - The student receives a personalized welcome message containing the single-use invite link.
3. **If Rejected**:
   - Status updates to `'rejected'` with the specified `reject_reason`.
   - The student receives an explanatory message prompting them to contact support or retry.

---

## 8. Admin Command Center & Operations

### Access Control & Authorization
Every administrative command and action callback is protected by the `adminOnly` higher-order middleware in [bot/src/handlers/admin.js](file:///c:/Users/Hp/Desktop/Full-Stack-Dev/React-Js/Client-01/next-tech-hub/bot/src/handlers/admin.js):

```javascript
function isAdmin(ctx) {
  const adminId = process.env.ADMIN_CHAT_ID;
  const fromId  = String(ctx.from?.id ?? "");
  const chatId  = String(ctx.chat?.id ?? "");
  return adminId && (fromId === String(adminId) || chatId === String(adminId));
}
```
Any unauthorized user attempting to run admin commands receives a `🚫 You are not authorized to use this command.` rejection message.

### Command Reference Guide

| Command | Syntax | Description | Example |
|---|---|---|---|
| `/pending` | `/pending` | Lists all unreviewed orders awaiting payment or with screenshot sent | `/pending` |
| `/approve` | `/approve <ORDER_CODE>` | Approves an order, marks it in DB, and dispatches invite links | `/approve NT-1002` |
| `/reject` | `/reject <ORDER_CODE> <REASON>` | Rejects an order with a reason and notifies the student | `/reject NT-1002 Incorrect amount sent` |
| `/find` | `/find <QUERY>` | Searches orders by Order Code, student Name, or Phone | `/find Abebe` or `/find NT-1001` |
| `/resend` | `/resend <ORDER_CODE>` | Re-dispatches channel invite links to an already approved student | `/resend NT-1002` |
| `/stats` | `/stats` | Displays total revenue, total approved students, and plan breakdown | `/stats` |

### Inline Interactive Action Callbacks
When an admin notification arrives in Telegram:
- **`admin_approve_NT-XXXX`**: Clicking `[✅ Approve]` immediately processes approval and sends channel access without typing any commands.
- **`admin_reject_NT-XXXX`**: Clicking `[❌ Reject]` provides instructions to specify a rejection reason via `/reject NT-XXXX <reason>`.

---

## 9. Configuration & Environment Variables

### Bot Environment Variables (`bot/.env`)

These variables must be populated inside `bot/.env` (refer to `bot/.env.example`):

| Variable | Required | Description & Source |
|---|---|---|
| `BOT_TOKEN` | **Yes** | Telegram Bot API token obtained from `@BotFather`. |
| `ADMIN_CHAT_ID` | **Yes** | Numeric Telegram ID of the admin. Obtain via `@userinfobot`. |
| `TELEBIRR_NUMBER` | **Yes** | TeleBirr phone number displayed to students for payment. |
| `CBE_ACCOUNT` | **Yes** | Commercial Bank of Ethiopia 13-digit account number. |
| `ACCOUNT_HOLDER_NAME` | **Yes** | Exact name registered on the banking accounts (e.g. `Nahom J.`). |
| `PRIVATE_CHANNEL_ID` | **Yes** | Numeric negative chat ID of the private tutorial channel (`-100...`). |
| `CHANNEL_SEM1_ID` | Optional | Secondary alias for Semester 1 private channel ID. |
| `CHANNEL_SEM2_ID` | Optional | Secondary alias for Semester 2 private channel ID. |
| `ANNOUNCEMENTS_CHANNEL` | Optional | Public announcements channel URL (default: `https://t.me/campus_study_hub`). |
| `DATA_DIR` | Optional | Custom path for SQLite database files (used for persistent disks on cloud hosts). |
| `PORT` | Optional | Port for the HTTP health check web server (default: `3000`). |
| `NODE_ENV` | Optional | Environment mode: `production` or `development`. |

### Central Bot Settings (`bot/config.js`)
- `PRICING`: Price in ETB for `sem1` (399), `sem2` (399), and `full` (699).
- `PLAN_LABELS`: Human-readable labels for plans.
- `ORDER_CODE_PREFIX`: Prefix for order identifiers (`NT`). Orders use a 6-character non-sequential random alphanumeric code (e.g. `NT-8K3P9Q`, ~1.07B combinations) to prevent sequential guessing.
- `MAX_OPEN_ORDERS`: Max unfulfilled orders per student (`3`) to mitigate spam.
- `INVITE_LINK_EXPIRY_HOURS`: Duration before single-use invite links expire (`48` hours).

### Frontend Configuration (`frontend/src/data/courses.js`)
- `BOT_USERNAME`: Username of the target Telegram bot (e.g. `CSH_Tutorial_bot`).
- `SEM_PRICE`: Semester 1 price (`399`).
- `FULL_YEAR_PRICE`: Full year price (`699`).
- `MAIN_CHANNEL_LINK`: Public community channel URL.
- `COURSES`: Object containing syllabus data, icons, descriptions, and official curriculum references.

---

## 10. Local Development Setup

### Prerequisites
- **Node.js**: Version 18.0.0 or higher ([nodejs.org](https://nodejs.org))
- **npm**: Version 9.0.0 or higher
- **Telegram Account**: To interact with `@BotFather` and run test purchases.

### Bot Setup & Startup

1. Open a terminal and navigate to the bot directory:
   ```bash
   cd next-tech-hub/bot
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment template:
   ```bash
   # On Windows PowerShell:
   copy .env.example .env
   # On Linux/macOS:
   cp .env.example .env
   ```
4. Open `.env` and fill in your test bot credentials.
5. Run the bot in development mode (with auto-reload on file edits):
   ```bash
   npm run dev
   ```
   *Expected output:*
   ```
   [INFO] Database initialized with sql.js at .../data/orders.db
   [INFO] CSH Tutorial Bot (@YourBotName) is now ONLINE and ready!
   [INFO] Health check web server running on port 3000
   ```

### Frontend Setup & Startup

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd next-tech-hub/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 11. Production Deployment Architecture

### Bot on Render (Free Web Service)
Render is an ideal zero-cost hosting option because the bot includes a built-in HTTP server listening on `PORT`:

1. Commit your codebase to a private GitHub repository.
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Create a **New Web Service** pointing to your repository.
4. Configure service settings:
   - **Root Directory**: `bot`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add all required environment variables in the Render Dashboard (**Environment** tab).
6. **Set up Keep-Alive (UptimeRobot)**: Free Render web services spin down after 15 minutes of HTTP inactivity. Set up a free HTTP monitor at [uptimerobot.com](https://uptimerobot.com) targeting your Render app URL (`https://your-app.onrender.com`) every 5 minutes.

### Bot on VPS with PM2
For dedicated production servers (Ubuntu / Debian VPS):

1. Install Node.js 18+ and PM2 globally:
   ```bash
   sudo npm install -g pm2
   ```
2. Clone repository and install dependencies in `bot/`:
   ```bash
   cd bot
   npm install --omit=dev
   ```
3. Launch via PM2 using the included configuration:
   ```bash
   pm2 start ecosystem.config.cjs
   pm2 save
   pm2 startup
   ```
4. Useful PM2 commands:
   - Check status: `pm2 status`
   - View live logs: `pm2 logs next-tech-bot`
   - Restart service: `pm2 restart next-tech-bot`

### Frontend on Vercel or Netlify
Because the frontend is a pure static React application:

1. Import the repository in [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Set **Root Directory** to `frontend`.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Deploy. Every push to your `main` branch will automatically build and publish.

---

## 12. Security, Fraud Prevention & Error Handling

1. **Telegram Admin Verification**: All `/approve`, `/reject`, and `/stats` commands strictly verify that `ctx.from.id` matches `ADMIN_CHAT_ID`.
2. **Anti-Phishing Safety Warnings**: Both the web application and the bot display prominent safety notices explicitly listing the authorized account holder name (`process.env.ACCOUNT_HOLDER_NAME`).
3. **Single-Use Invite Links**: To prevent paid students from forwarding invite links to unauthorized peers, the bot attempts to create links with `member_limit: 1` and a 48-hour expiration date.
4. **Order Flood Protection**: `MAX_OPEN_ORDERS` limits each student to 3 concurrent active orders to prevent database spamming.
5. **Crash-Resistant Bot Catch Handler**: Telegraf registers a top-level error interceptor (`bot.catch`) preventing unhandled promise rejections from crashing the bot process.
6. **HTML Injection Protection**: All dynamic user inputs (student names, usernames, order codes) are sanitized through `escapeHtml()` before being rendered into Telegram HTML messages.

---

## 13. Troubleshooting & Maintenance Playbook

### Issue: Bot crashes immediately on startup
- **Cause**: One or more required environment variables are missing from `bot/.env`.
- **Solution**: Check console logs for `Missing required environment variables: ...`. Ensure `BOT_TOKEN`, `ADMIN_CHAT_ID`, `TELEBIRR_NUMBER`, `CBE_ACCOUNT`, `ACCOUNT_HOLDER_NAME`, and `PRIVATE_CHANNEL_ID` are defined.

### Issue: Bot does not generate channel invite links
- **Cause**: The bot has not been added to the private Telegram channel, or does not have administrator privileges.
- **Solution**: 
  1. Open your private Telegram channel.
  2. Go to **Channel Settings** → **Administrators** → **Add Administrator**.
  3. Search for your bot handle and grant the permission: **Invite Users via Link**.

### Issue: Database file corruption or disk error
- **Cause**: Server was forcibly terminated or disk ran out of memory.
- **Solution**: The database module automatically archives damaged databases to `orders.db.corrupt.<timestamp>` and starts a new one. To manually inspect or repair:
  ```bash
  # Check database directory
  ls -la bot/data/
  ```

### Issue: Admin commands give "🚫 You are not authorized"
- **Cause**: `ADMIN_CHAT_ID` does not match your numeric Telegram ID.
- **Solution**:
  1. Message `@userinfobot` on Telegram from your admin account to get your numeric ID (e.g., `123456789`).
  2. Update `ADMIN_CHAT_ID=123456789` in `bot/.env`.
  3. Restart the bot.

---

*Documentation maintained by the CSH Tutorial Engineering Team.*
