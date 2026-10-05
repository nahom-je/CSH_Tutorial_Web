# NeXT-TeCH Freshman Hub — Setup & Deployment Guide

> **⚠️ URGENT — Do this first:**
> Your real bot token was found inside `bot/.env`. **Revoke it now:**
> Open Telegram → `@BotFather` → `/mybots` → select your bot → **API Token** → **Revoke current token**.
> Generate a new token and paste it in `.env`. Do NOT commit `.env` to Git — it is already in `.gitignore`.

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Local Development](#local-development)
3. [Pre-Launch Checklist](#pre-launch-checklist)
4. [Deploy the Bot — Render](#deploy-the-bot--render)
5. [Deploy the Frontend — Vercel](#deploy-the-frontend--vercel)
6. [Hosting Options Compared](#hosting-options-compared)
7. [Database Backup & Restore](#database-backup--restore)
8. [Manual Test Script](#manual-test-script)

---

## Project Structure

```
next-tech-hub/
├── bot/                         <- Node.js Telegram bot (runs on server 24/7)
│   ├── src/
│   │   ├── bot.js               <- entry point
│   │   ├── db/database.js       <- sql.js SQLite database
│   │   ├── handlers/            <- start, wizard, screenshot, admin
│   │   └── utils/               <- session, delivery, helpers, logger
│   ├── data/                    <- orders.db lives here (auto-created)
│   ├── logs/                    <- app.log lives here (auto-created)
│   ├── .env                     <- your secrets (NEVER commit this)
│   ├── .env.example             <- copy this to .env and fill values
│   ├── config.js                <- prices, plan labels, channel IDs
│   ├── render.yaml              <- Render deployment config (auto-read)
│   └── ecosystem.config.cjs    <- PM2 config (for VPS hosting)
└── frontend/                    <- React + Vite landing page (static site)
    ├── src/
    │   └── data/courses.js      <- edit bot username and prices here
    └── vite.config.js
```

---

## Local Development

### Prerequisites
- **Node.js 18+** — download from [nodejs.org](https://nodejs.org)
- A Telegram bot token from `@BotFather`

### 1. Set up the bot

```bash
cd next-tech-hub/bot

# Install dependencies
npm install

# Copy the example env file
cp .env.example .env   # on Windows: copy .env.example .env
```

Open `bot/.env` and fill in every value:

| Variable | Where to get it |
|---|---|
| `BOT_TOKEN` | `@BotFather` → `/mybots` → API Token |
| `ADMIN_CHAT_ID` | Start your bot, check `bot/logs/app.log` for your chat_id |
| `TELEBIRR_NUMBER` | Your TeleBirr number |
| `CBE_ACCOUNT` | Your CBE account number |
| `ACCOUNT_HOLDER_NAME` | Name exactly as shown in your banking app |
| `CHANNEL_SEM1_ID` | Forward any channel message to `@userinfobot`, get the negative ID |
| `CHANNEL_SEM2_ID` | Same for Semester 2 channel (or same ID if one channel) |
| `PDF_LINK_SEM1` | Your Google Drive folder share link for Sem 1 |
| `PDF_LINK_SEM2` | Your Google Drive folder share link for Sem 2 |
| `ANNOUNCEMENTS_CHANNEL` | Your public Telegram channel link |
| `DATA_DIR` | Leave empty for local dev |

> **Important:** If you only have ONE private channel for both semesters, set
> `CHANNEL_SEM1_ID` and `CHANNEL_SEM2_ID` to the same value.

```bash
# Start the bot in development mode (auto-restarts on file changes)
npm run dev
```

Watch the terminal. You should see:
```
[INFO] Database initialized with sql.js at .../data/orders.db
[INFO] NeXT-TeCH Bot (@YourBotName) is now ONLINE and ready!
```
And a "Bot is ONLINE" message should arrive in your Telegram.

### 2. Set up the frontend

```bash
cd next-tech-hub/frontend

npm install
npm run dev
```

Open http://localhost:5173 in your browser.

**To update prices or bot username**, edit `frontend/src/data/courses.js`:
```js
export const BOT_USERNAME = "YourBotUsername"; // without @
export const SEM_PRICE = 400;
export const FULL_YEAR_PRICE = 700;
```

---

## Pre-Launch Checklist

- [ ] **Revoke and regenerate your bot token** — see warning at top of this file
- [ ] Confirm `CHANNEL_SEM1_ID` vs `CHANNEL_SEM2_ID` — same or different channels?
- [ ] **PDF links** — replace placeholder URLs with real Google Drive share links
- [ ] **Bot is admin in the Telegram channel** — add your bot as Admin so it can create invite links
- [ ] `frontend/src/data/courses.js` `BOT_USERNAME` matches your actual bot username
- [ ] Prices in `frontend/src/data/courses.js` match prices in `bot/config.js`
- [ ] Run the full test flow locally before deploying (see Manual Test Script)
- [ ] `.env` is NOT committed to Git (`git status` should not show `.env`)

---

## Deploy the Bot — Render

Render is the recommended host for the bot. It supports persistent disk storage (required for `orders.db`), auto-deploys from GitHub, and the `render.yaml` is already configured.

> **Cost note:** Verify current pricing at render.com/pricing. A persistent disk requires at minimum the **Starter** plan. The free plan does NOT have a persistent disk — your orders will vanish on every deploy.

### Steps

**1. Push your code to GitHub**
```bash
cd next-tech-hub
git init
git add .
git commit -m "Initial commit"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/next-tech-hub.git
git push -u origin main
```

> Confirm `.env` is NOT in the commit: `git show HEAD --name-only | grep .env` should return nothing.

**2. Create the service on Render**
- Go to render.com and sign up/log in
- Click **New** → **Blueprint**
- Connect your GitHub account and select the `next-tech-hub` repo
- Render reads `render.yaml` automatically and sets up the worker + disk

**3. Add environment variables**

In the Render dashboard → your service → **Environment** tab, add each secret:
- `BOT_TOKEN` — your NEW token from BotFather
- `ADMIN_CHAT_ID` — your Telegram numeric user ID
- `TELEBIRR_NUMBER`, `CBE_ACCOUNT`, `ACCOUNT_HOLDER_NAME`
- `CHANNEL_SEM1_ID`, `CHANNEL_SEM2_ID`
- `PDF_LINK_SEM1`, `PDF_LINK_SEM2`
- `ANNOUNCEMENTS_CHANNEL`
- `DATA_DIR` — `/opt/render/project/src/data` (already in render.yaml)

**4. Deploy and verify**
- Click **Deploy**
- Watch the **Logs** tab — you should see `NeXT-TeCH Bot is now ONLINE`
- You should also receive a Telegram DM from your bot

**5. Confirm the disk exists**
- Render dashboard → your service → **Disks** tab
- `bot-data` disk should be mounted at `/opt/render/project/src/data`

### Future deployments
Just `git push` — Render auto-deploys every push to `main`.

---

## Option 1B: Deploy the Bot to Oracle Cloud (100% Free Forever VPS)

If you don't want to pay monthly hosting fees, Oracle Cloud offers an **"Always Free" Tier** that includes free virtual cloud servers (VPS) with permanent disk storage, running 24/7.

### What you get for $0/month:
- **Compute:** 1–4 vCPUs, up to 24 GB RAM (Ampere ARM) or 1 GB RAM (AMD Micro)
- **Disk:** 50–200 GB permanent SSD storage (your `orders.db` is safe forever)
- **Uptime:** 24/7/365 — does not sleep or shut down

> **Note on sign-up:** Oracle requires a credit/debit card for fraud verification during signup. They place a temporary ~$1 hold that is immediately refunded. You will NOT be billed.

---

### Step-by-Step Setup

#### 1. Create your Oracle Cloud Account
1. Go to [oracle.com/cloud/free](https://www.oracle.com/cloud/free/) and click **Start for free**.
2. Complete signup and choose your **Home Region** (e.g. Frankfurt, London, or Jeddah for fast connection).

#### 2. Create an Always Free Instance
1. In the Oracle Console, go to **Compute** → **Instances** → **Create Instance**.
2. **Name:** `next-tech-bot`
3. **Image:** Choose **Ubuntu 24.04** or **Ubuntu 22.04 Minimal**.
4. **Shape:** 
   - Choose **VM.Standard.A1.Flex** (Ampere ARM - 1 to 2 OCPUs, 6 to 12 GB RAM) OR **VM.Standard.E2.1.Micro** (AMD). Look for the "Always Free Eligible" label.
5. **Add SSH Keys:** 
   - Click **Generate a key pair for me** and **Save Private Key** (download the `.key` file to your PC!).
6. Click **Create** and wait 1–2 minutes until the status turns **Running**. Copy your **Public IP Address** (e.g., `129.151.xx.xx`).

#### 3. Connect from your Windows PC via SSH
Open PowerShell on your PC:
```powershell
# If your key is in Downloads (replace with your real path and IP):
ssh -i "$HOME\Downloads\ssh-key-*.key" ubuntu@YOUR_SERVER_IP
```

#### 4. Install Node.js & Git on the Server
Once connected inside the server terminal:
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# Verify installation
node -v
npm -v

# Install PM2 globally (Process Manager to keep bot running 24/7)
sudo npm install -g pm2
```

#### 5. Clone your Repository & Setup the Bot
```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/next-tech-hub.git
cd next-tech-hub/bot

# Install bot dependencies
npm install

# Create your production .env file
nano .env
```
Paste your real environment variables into `nano`:
```env
BOT_TOKEN=your_new_token_from_botfather
ADMIN_CHAT_ID=your_telegram_user_id
TELEBIRR_NUMBER=09XXXXXXXX
CBE_ACCOUNT=1000XXXXXXXXX
ACCOUNT_HOLDER_NAME=Your Full Name
CHANNEL_SEM1_ID=-100XXXXXXXXXX
CHANNEL_SEM2_ID=-100XXXXXXXXXX
PDF_LINK_SEM1=https://drive.google.com/your-real-sem1-link
PDF_LINK_SEM2=https://drive.google.com/your-real-sem2-link
ANNOUNCEMENTS_CHANNEL=@YourChannel
DATA_DIR=/home/ubuntu/next-tech-hub/bot/data
```
Press `Ctrl+O` then `Enter` to save, and `Ctrl+X` to exit.

#### 6. Start the Bot with PM2 (24/7 Autopilot)
```bash
# Start bot process
pm2 start src/index.js --name "next-tech-bot"

# Check status
pm2 status

# View live logs
pm2 logs next-tech-bot

# Configure PM2 to auto-start if server ever reboots
pm2 startup
# (Copy and run the command that PM2 prints out, if prompted)
pm2 save
```

🎉 **Done!** Your bot is now running in the cloud 24/7. You can close your terminal and turn off your PC.

#### Helpful Maintenance Commands on the Server
```bash
# Pull new updates from GitHub
cd ~/next-tech-hub
git pull
cd bot && npm install
pm2 restart next-tech-bot

# Check bot logs
pm2 logs next-tech-bot --lines 50

# Backup orders.db to your PC anytime
# (Run this from your Windows PowerShell, NOT the server):
scp -i "$HOME\Downloads\your-key.key" ubuntu@YOUR_SERVER_IP:~/next-tech-hub/bot/data/orders.db "$HOME\Desktop\orders_backup.db"
```

---

## Deploy the Frontend — Vercel

Vercel is free for static sites, has a global CDN, and auto-deploys from GitHub.

**Steps:**
1. Go to vercel.com and sign up with GitHub
2. Click **Add New Project** → Import `next-tech-hub` repo
3. Set **Root Directory** to `frontend`
4. Framework preset auto-detects **Vite** — leave defaults
5. Click **Deploy**

You will get a URL like `next-tech-hub.vercel.app`.

**Custom domain (optional):**
- Vercel dashboard → your project → Domains → add your domain
- Update your domain DNS records as shown by Vercel

---

## Hosting Options Compared

> Prices change. Verify at provider websites before paying.

| Provider | What for | Notes | Persistent disk | Cost |
|---|---|---|---|---|
| **Oracle Cloud** (Always Free) | Bot | Full Linux VPS. Best 100% free option. | Yes (50–200 GB) | **$0 / month** |
| **Vercel** (Free) | Frontend | Fast global CDN. Perfect for React. | N/A | **$0 / month** |
| **Render** (Starter) | Bot | Easy setup, auto-deploys from GitHub. | Yes (1 GB) | ~$7 / month |
| **Railway** | Bot | Modern cloud, simple persistent volumes. | Yes | Pay as you go |

**Recommendations:**
- **Zero Cost (Free Forever):** Bot on **Oracle Cloud Always Free VPS** + Frontend on **Vercel**
- **Zero Maintenance (Paid):** Bot on **Render Starter** + Frontend on **Vercel**

### VPS alternative (DigitalOcean / any Linux VPS)
If you want more control, use PM2:
```bash
# On the VPS, after uploading code and setting up .env
cd bot
npm install
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save                # saves process list
pm2 startup             # follow the printed command to enable reboot auto-start
```

---

## Database Backup & Restore

`orders.db` is your only source of truth. Back it up regularly.

### Manual backup from Render
Render does not provide SSH on the free/starter plan. Use their shell feature or download via the Render CLI:
```bash
# Install Render CLI
npm install -g @render-com/render-cli
render ssh <service-name>
# Then inside the shell:
cp /opt/render/project/src/data/orders.db /tmp/orders.backup.db
```

### Automated daily backup on VPS (cron)
```bash
crontab -e
# Add this line (runs at 3am every day, keeps last 7 backups):
0 3 * * * cp /opt/bot/data/orders.db /opt/bot/backups/orders.$(date +\%Y\%m\%d).db && ls -t /opt/bot/backups/orders.*.db | tail -n +8 | xargs rm -f
```

### Restore
```bash
# Stop bot first
pm2 stop next-tech-bot
# Replace the DB
cp orders.db.backup-YYYYMMDD /path/to/data/orders.db
# Start bot again
pm2 start next-tech-bot
```

---

## Manual Test Script

Run through ALL of these before going live:

### 1. Normal purchase (Semester 1)
1. Open `https://t.me/YourBot?start=sem1`
2. Tap "Yes, I am a freshman"
3. Enter: Name → Username → Phone number
4. Choose payment method
5. Tap "I've sent the screenshot"
6. **Expected:** Admin gets notification with Approve / Reject buttons
7. Admin taps **Approve**
8. **Expected:** Student receives a PDF link + Telegram channel invite link

### 2. Wrong input mid-wizard
1. Start bot, reach "Enter your name" step
2. Send a **photo or sticker**
3. **Expected:** Bot says "I can only accept text at this step" — does NOT crash

### 3. Double Approve tap
1. Complete a purchase, admin taps Approve
2. Admin taps Approve again (or sends `/approve NT-XXXX`)
3. **Expected:** Bot says "Order NT-XXXX is already approved" — does NOT deliver twice

### 4. Reject with special characters
1. Send `/reject NT-XXXX Payment screenshot unclear. (Wrong amount!)`
2. **Expected:** Student receives the rejection message — bot does NOT crash

### 5. Bot restart mid-order
1. Start the wizard, reach the phone step
2. Restart the bot (`Ctrl+C` → `npm run dev`)
3. Send your phone number
4. **Expected:** Bot politely tells you to `/start` again (session is gone after restart)

### 6. Blocked bot
1. Student blocks the bot in Telegram
2. Admin approves their order
3. **Expected:** Admin receives a warning message ("Failed to deliver access")
4. Admin uses `/resend NT-XXXX` after student unblocks bot
5. **Expected:** Access is delivered successfully

### 7. Full Year plan
1. Open `https://t.me/YourBot?start=full`
2. Complete purchase and get approved
3. **Expected:** Student receives **two** invite links + **two** PDF links (Sem 1 and Sem 2)

### 8. Duplicate order spam
1. Complete a purchase (status = `screenshot_sent`)
2. Immediately start `/start` again and complete another one
3. Repeat until blocked
4. **Expected:** After 3 open orders, bot blocks you with "You already have open orders"

---

*Last updated: October 2026. Verify all provider pricing and free-tier limits yourself before committing.*
