# CSH Tutorial — Complete System Architecture & Flow

This document provides a comprehensive technical overview of the **CSH Tutorial Platform** (NeXT-TeCH Freshman Hub), explaining how the **Frontend**, **Backend**, **Database (Supabase)**, **Telegram Bot Ecosystem**, and **Hosting Environments (Render & Vercel)** interact to deliver a streamlined tutorial subscription, course material delivery, and interactive chapter quiz experience.

---

## 1. Executive Summary & Purpose

**CSH Tutorial** is a dedicated digital learning and assessment platform tailored specifically for Ethiopian university freshman students (with standard curriculum aligned to Jimma University - JU).

Freshman students are split into two main streams:
1. **Natural Science** (General Physics, Mathematics for Natural Science, Communicative English Language 1, Geography, Logic and Critical Thinking, General Psychology)
2. **Social Science** (General Economics, Mathematics for Social Science, Communicative English Language 1, Geography, Logic and Critical Thinking, General Psychology)

The system automates the complete student lifecycle:
- Course bundle exploration via a modern web landing page.
- Subscription registration and receipt upload via Telegram Bot (`@CSH_Tutorial_bot`).
- Admin approval workflow with instant fulfillment.
- Channel delivery via permanent, single-use dynamic invite links.
- Stream-organized web & in-bot quiz testing platform with anti-account sharing device locking.
- Custom software development and service acquisition banner.

---

## 2. High-Level Architecture Diagram

```mermaid
flowchart TD
    subgraph Telegram_Ecosystem ["Telegram Ecosystem"]
        Student["📱 Student / Freshman"]
        Admin["👮 Admin (@Umeribnukedir)"]
        PrivateChannel["🔒 CSH Private Channel"]
    end

    subgraph Hosting_Render ["Render (Backend Server)"]
        BotService["🤖 CSH Tutorial Bot (Telegraf Node.js)"]
        HttpApi["🌐 HTTP API (/api/verify-order, health ping)"]
    end

    subgraph Hosting_Vercel ["Vercel (Frontend Client)"]
        WebApp["💻 React 18 + Vite Landing Page\n(csh-tutorial-web.vercel.app)"]
        QuizHome["🏠 /quizzes (Stream-Organized Catalog)"]
        QuizRunner["⏱️ /quiz/:id (Timed Exam Engine)"]
        CustomDev["💼 Custom Dev Banner (@NahomJ2)"]
    end

    subgraph Database_Supabase ["Supabase (PostgreSQL Cloud)"]
        OrdersTable[("📋 orders table\n(status: awaiting_payment, approved, etc.)")]
        QuizTable[("📚 courses, chapters, questions\n(Organized by stream, 1,000+ questions)")]
    end

    %% Student Registration
    Student -->|1. /start, stream selection, registration| BotService
    BotService -->|2. Create order record: awaiting_payment| OrdersTable
    Student -->|3. Uploads CBE / Telebirr receipt| BotService
    BotService -->|4. Update status: screenshot_sent| OrdersTable
    BotService -->|5. Alert with photo & [Approve] / [Reject]| Admin

    %% Admin Approval
    Admin -->|6. Approve order (/approve NT-XXXX)| BotService
    BotService -->|7. Update status: approved| OrdersTable
    BotService -->|8. Deliver single-use invite link + code NT-XXXX| Student
    Student -->|9. Join private study channel| PrivateChannel

    %% Web Access Verification
    Student -->|10. Visits /quizzes with order code| WebApp
    WebApp -->|11. Verify order & bind device_id| HttpApi
    HttpApi -->|12. Validate approval & device match| OrdersTable
    HttpApi --"[200 OK] Access Granted"--> WebApp
    WebApp -->|13. Read questions & chapters| QuizTable
```

---

## 3. Core Components

### A. The Backend: Node.js & Telegraf Bot (`/bot`)
- **Hosting:** [Render](https://render.com) (Service: `csh-tutorial-bot`)
- **Runtime:** Node.js (ES Modules)
- **Framework:** `telegraf` + native HTTP server
- **Role:** 
  1. Telegram bot interface for student signups, plan selection, receipt uploads, and quiz execution.
  2. Lightweight REST API (`/api/verify-order`) consumed by the web frontend for cryptographic order code verification and single-device lock management.
  3. Gatekeeper for private channel access links and administrative controls.

#### Key Modules:
- `bot/src/bot.js`: Entry point, initializes bot listeners and starts the HTTP verification API server on port 3000.
- `bot/src/handlers/wizard.js`: Multi-step interactive registration wizard (Name → Telegram Handle → Department/Stream [Natural / Social] → Plan [Semester 1 / Semester 2 / Full Year] → Payment Method). Generates collision-resistant order codes (`NT-XXXXXX`).
- `bot/src/handlers/screenshot.js`: Receives payment receipts/screenshots, updates order status to `screenshot_sent`, and forwards the receipt with interactive one-click approve/reject buttons to the admin chat.
- `bot/src/handlers/admin.js`: Comprehensive command interface (`/pending`, `/approve`, `/reject`, `/stats`, `/resend`, `/lockall`, `/unlockall`).
- `bot/src/handlers/quiz.js`: In-bot quiz runner with stream selection menu (Natural vs. Social), chapter navigation, instant score calculation, and step-by-step answer explanations.
- `bot/src/utils/delivery.js`: Generates single-use dynamic invite links to the private tutorial channel (without arbitrary expiration times so valid links never spoil) and delivers the student's order code and quiz platform access link.

---

### B. The Frontend: React & Vite Single Page App (`/frontend`)
- **Hosting:** [Vercel](https://vercel.com) (`https://csh-tutorial-web.vercel.app`)
- **Framework:** React 18, Vite, React Router DOM, Custom Modern CSS Design System (8px grid scale).
- **Role:** Fast, responsive client application serving both marketing/onboarding content and the interactive quiz examination engine.

#### Key Pages & Components:
- `frontend/src/App.jsx`: Top-level routing (`/`, `/quizzes`, `/quiz/:chapterId`).
- `frontend/src/components/Hero.jsx`: High-contrast hero section with call-to-actions, freshman badge, and dynamic course statistics.
- `frontend/src/components/VideoShowcase.jsx`: Orientation video demo player previewing tutorial materials.
- `frontend/src/components/Courses.jsx`: Curriculum directory categorized by freshman semesters and streams.
- `frontend/src/components/Pricing.jsx`: Tier pricing cards (Semester 1 at 399 ETB, Full Year at 699 ETB).
- `frontend/src/components/CustomDev.jsx`: High-polish service showcase CTA for custom web and mobile app development inquiries connecting directly to Telegram (**@NahomJ2**, `+251 96 454 9757`) and Email (`nahomjemberu22@gmail.com`).
- `frontend/src/pages/QuizHome.jsx`: Stream-organized quiz catalog featuring tabs for **Natural Science (6 Courses)** and **Social Science (6 Courses)**. Includes automatic stream detection based on verified student order codes and search filtering.
- `frontend/src/pages/QuizRunner.jsx`: Practice examination runner featuring countdown timers, option selection, score percentages, and detailed answer explanations.
- `frontend/src/lib/quizAccess.js`: Client-side access controller. Communicates with backend `/api/verify-order`, manages persistent local device fingerprints, and caches student stream metadata.

---

### C. The Database: Supabase PostgreSQL
- **Hosting:** [Supabase](https://supabase.com)
- **Role:** Cloud PostgreSQL datastore for orders, courses, chapters, and question banks.

#### 1. `orders` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `bigint / uuid` | Unique primary key |
| `order_code` | `text` (Unique) | Access token formatted as `NT-XXXXXX` |
| `telegram_id` | `bigint` | Student's Telegram user ID |
| `telegram_username`| `text` | Student's Telegram username |
| `name` | `text` | Student's full legal name |
| `department` | `text` | Enrolled academic stream (`Natural` or `Social`) |
| `phone` | `text` | Student contact number |
| `plan` | `text` | Subscribed plan (`sem1`, `sem2`, or `full`) |
| `price` | `integer` | Paid price in ETB (e.g. `399`, `699`) |
| `method` | `text` | Payment channel (`telebirr` or `cbe`) |
| `status` | `text` | `awaiting_payment` → `screenshot_sent` → `approved` / `rejected` |
| `screenshot_file_id` | `text` | Telegram photo file ID of payment proof |
| `reject_reason` | `text` | Rejection explanation sent to user if unapproved |
| `device_id` | `text` | Unique client device hash bound on first web login |
| `created_at` | `timestamptz` | Submission timestamp |
| `reviewed_at` | `timestamptz` | Administrator approval timestamp |

#### 2. Academic Curriculum Tables
- **`courses`**:
  - `code`: Course code (e.g., `MATH-1011`, `PHYS-1011`, `ECON-1011`, `ENGL-1011`, `GEOG-1011`, `PHIL-1011`, `PSYC-1011`).
  - `title`: Course display title.
  - `stream`: `Natural`, `Social`, or `Both`.
- **`chapters`**:
  - `course_id`: Foreign key referencing `courses.id`.
  - `chapter_number`: Integer chapter sequence.
  - `title`: Chapter title (e.g., *Propositional Logic and Set Theory*).
  - `is_locked`: Boolean flag allowing synchronized paced release with video lectures.
- **`questions`**:
  - `chapter_id`: Foreign key referencing `chapters.id`.
  - `question_number`: Sequence within the chapter.
  - `difficulty`: `Easy`, `Medium`, or `Hard`.
  - `question_text`: Complete problem statement.
  - `options`: JSON array of choices `[{"id":"A","text":"..."},{"id":"B","text":"..."}]`.
  - `correct_option`: Correct key (`A`, `B`, `C`, `D`, or `E`).
  - `explanation`: Full step-by-step solution derivation.

---

## 4. End-to-End Operational Workflows

### Flow 1: Registration & Payment Proof
1. A student opens `@CSH_Tutorial_bot` on Telegram and executes `/start`.
2. The registration conversation wizard collects:
   - Full Name
   - Phone Number
   - Academic Stream (**Natural Science** or **Social Science**)
   - Subscription Plan (**Semester 1**, **Semester 2**, or **Full Year**)
   - Payment Choice (**TeleBirr** or **Commercial Bank of Ethiopia - CBE**)
3. The bot generates a unique order code (`NT-XXXXXX`) and writes a record to Supabase with status `awaiting_payment`.
4. The bot provides exact transfer instructions (Account numbers and Account holder name) and prompts the student to attach a receipt screenshot.

### Flow 2: Admin Approval & Instant Fulfillment
1. The student uploads their payment screenshot.
2. The bot updates the order in Supabase to `screenshot_sent` and notifies the student to stand by for verification.
3. The bot immediately pushes the receipt photo, student metadata, and interactive `[✅ Approve]` / `[❌ Reject]` inline buttons to the admin chat (`@Umeribnukedir`).
4. Upon admin approval:
   - Status transitions to `approved`.
   - The bot generates an exclusive, single-use Telegram private channel invite link (`member_limit: 1`, permanent until joined).
   - The bot messages the student with their official approval notification, their channel link, their authorized **Order Code**, and a direct login link to the web quiz portal.

### Flow 3: Web Quiz Access & Single-Device Anti-Sharing Protection
1. The student navigates to `https://csh-tutorial-web.vercel.app/quizzes`.
2. The student enters their `NT-XXXXXX` order code (or lands via the query parameter `?order=NT-XXXXXX`).
3. The frontend creates or reads a persistent device fingerprint (`csh_device_id`) stored in browser storage.
4. The client queries the backend verification endpoint:
   ```http
   GET https://csh-tutorial-bot.onrender.com/api/verify-order?code=NT-XXXXXX&device_id=dev_xxxxxx
   ```
5. **Security Verification Rules:**
   - The order code must exist and be marked `approved`.
   - **First Login:** If `order.device_id` is null, the backend automatically locks and writes `dev_xxxxxx` to the student's order record.
   - **Subsequent Logins:** If the incoming `device_id` matches the stored `device_id`, access is granted.
   - **Device Collision:** If an order code is used on a secondary phone/laptop, access is blocked (`403 Forbidden` with `device_locked: true`).
6. **Legitimate Device Resets:** If a student switches devices legitimately, they can issue `/resetdevice` inside `@CSH_Tutorial_bot` to clear their device binding safely.

### Flow 4: Stream-Organized Quiz Architecture
- Shared courses (**Communicative English 1**, **Geography**, **Logic and Critical Thinking**, **General Psychology**, and **Mathematics**) draw from unified question banks with zero data duplication.
- Stream-specific courses (**General Physics** for Natural Science and **General Economics** for Social Science) are isolated.
- The web quiz interface groups courses into dedicated tabs with contextual labels (e.g. *Mathematics for Natural Science* vs. *Mathematics for Social Science*).
- When a verified student enters their code, the platform inspects their `department` attribute (`Natural` or `Social`) and automatically selects the corresponding stream view.

### Flow 5: Drip-Feed Chapter Lock Management
- Instructors can gate quiz chapters to release concurrently with video lessons.
- When a chapter has `is_locked: true`:
  - Web catalog displays a locked badge and prevents quiz initiation.
  - Direct URL access to `/quiz/:chapterId` renders a protected holding screen.
  - In-bot quiz displays `[Locked]` and prevents question rendering.
- Admins manage chapter locking on-the-fly via Telegram commands:
  - `/lockall` / `/unlockall`
  - `/lock <COURSE_CODE> <CHAPTER_NUM>`
  - `/unlock <COURSE_CODE> <CHAPTER_NUM>`
  - `/chapters <COURSE_CODE>`

### Flow 6: Mock Exam Portal & Server-Side Scoring
- Dedicated `/exam` route provides an exam simulation:
  1. **Student Registration:** Full Name, Student ID, and Ethiopian Phone Number validation (`09...`, `07...`, `+2519...`, `+2517...`).
  2. **Field & Subject Selection:** Filtered by Academic Stream (`Natural Science` vs `Social Science`). Currently available subjects: **Geography**, **Mathematics**, **Physics** (Natural only), and **Psychology**.
  3. **Exam Engine:**
     - Questions served via `GET /api/exam-questions` without correct answers to prevent inspect-element cheating.
     - Per-question countdown timer (60 seconds for general subjects, 90 seconds for Mathematics).
     - Live progress indicator (`Question X of Y`).
     - Auto-advancement when question timer reaches 0 (unanswered counts as incorrect).
     - Allows answering or changing selection before proceeding; submission permitted on the last question or upon final time expiry.
  4. **Scoring Integrity:**
     - Client submits answers payload to `POST /api/submit-exam`.
     - Score is calculated on the backend out of 20: `score = (correct / total) * 20` rounded to 1 decimal place.
     - Records saved permanently to the Supabase `exam_results` table.
     - Real-time Telegram notification delivered directly to admin (`ADMIN_CHAT_ID`).

---

## 5. Technology Stack Summary

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend Web** | React 18, Vite, React Router 6, CSS3 (Custom 8px Token System), Canvas-Confetti |
| **Telegram Bot** | Node.js (ESM), `telegraf`, REST API endpoints |
| **Database & Auth** | Supabase Cloud (PostgreSQL 15), Service Role API, Public Anon API |
| **Web Hosting** | [Vercel](https://vercel.com) (Continuous Deployment from GitHub `main`) |
| **Server Hosting** | [Render](https://render.com) (Web Service container hosting bot & HTTP verification) |
| **Source Control** | GitHub repository (`nahom-je/CSH_Tutorial_Web`) |

---

## 6. Environment Configuration Variables

### Backend Configuration (Render Environment)
- `BOT_TOKEN`: Secret Telegram bot API token from `@BotFather`.
- `ADMIN_CHAT_ID`: Telegram user ID of the platform administrator.
- `TELEBIRR_NUMBER`: Merchant/Recipient TeleBirr account number.
- `CBE_ACCOUNT`: Commercial Bank of Ethiopia account number.
- `ACCOUNT_HOLDER_NAME`: Registered name for bank transfers.
- `PRIVATE_CHANNEL_ID`: Unique integer ID of the private tutorial channel (`-1004330230276`).
- `SUPABASE_URL`: Supabase project connection URL (`https://vexmmdlqlhakipnhoycn.supabase.co`).
- `SUPABASE_SERVICE_KEY`: Privileged service key for bypassing RLS on order updates and approvals.
- `QUIZ_PLATFORM_URL`: Production URL for the quiz portal (`https://csh-tutorial-web.vercel.app/quizzes`).

### Frontend Configuration (Vercel Environment)
- `VITE_SUPABASE_URL`: Public Supabase endpoint URL.
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key restricted to reading published academic content.
- `VITE_BOT_API_URL`: Backend verification endpoint URL (`https://csh-tutorial-bot.onrender.com`).
