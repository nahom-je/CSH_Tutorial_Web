# 📚 CSH Tutorial — Chapter Quiz Lock/Unlock Admin Guide

This guide covers every command you need to control which chapter quizzes are accessible to students on both the **Web Platform** and the **Telegram Bot**.

All commands are sent directly to **@CSH_Tutorial_bot** on Telegram (admin only).

---

## ⚡ Quick Commands (Most Used)

| Command | What it does |
| :--- | :--- |
| `/lockall` | 🔒 Lock **ALL** chapters across all 7 courses at once |
| `/unlockall` | 🔓 Unlock **ALL** chapters across all 7 courses at once |
| `/lock COURSE_CODE NUM` | 🔒 Lock one specific chapter |
| `/unlock COURSE_CODE NUM` | 🔓 Unlock one specific chapter |
| `/chapters COURSE_CODE` | 📋 View locked/open status of all chapters in a course |

---

## 🏫 Course Codes Reference

| Course Code | Course Title | Stream |
| :--- | :--- | :--- |
| `ECON-1011` | Introduction to Economics | Social |
| `ENGL-1011` | English Grammar | Natural |
| `GEOG-1011` | Geography: Ethiopia and the Horn | Natural |
| `MATH-1011` | Mathematics for Natural Sciences | Natural |
| `PHIL-1011` | Logic and Critical Thinking | Natural |
| `PHYS-1011` | General Physics | Natural |
| `PSYC-1011` | General Psychology | Natural |

---

## 🔒 Lock ONE Chapter

**Syntax:**
```
/lock COURSE_CODE CHAPTER_NUMBER
```

**Examples:**
```
/lock ECON-1011 2
/lock PSYC-1011 3
/lock PHYS-1011 1
```

---

## 🔓 Unlock ONE Chapter

**Syntax:**
```
/unlock COURSE_CODE CHAPTER_NUMBER
```

**Examples:**
```
/unlock ECON-1011 1
/unlock PSYC-1011 1
/unlock GEOG-1011 1
```

---

## 📋 Check Status of a Course

```
/chapters ECON-1011
/chapters PSYC-1011
/chapters PHYS-1011
/chapters MATH-1011
/chapters PHIL-1011
/chapters GEOG-1011
/chapters ENGL-1011
```

---

## 📖 All Chapters — Complete Lock Command Reference

### 📈 ECON-1011 — Introduction to Economics (6 Chapters)

| Ch | Title | Lock | Unlock |
| :- | :---- | :--- | :----- |
| 1 | Basics of Economics | `/lock ECON-1011 1` | `/unlock ECON-1011 1` |
| 2 | Theory of Demand and Supply | `/lock ECON-1011 2` | `/unlock ECON-1011 2` |
| 3 | Theory of Consumer Behaviour | `/lock ECON-1011 3` | `/unlock ECON-1011 3` |
| 4 | The Theory of Production and Cost | `/lock ECON-1011 4` | `/unlock ECON-1011 4` |
| 5 | Market Structure | `/lock ECON-1011 5` | `/unlock ECON-1011 5` |
| 6 | Fundamental Concepts of Macroeconomics | `/lock ECON-1011 6` | `/unlock ECON-1011 6` |

---

### 📝 ENGL-1011 — English Grammar (1 Quiz)

| Ch | Title | Lock | Unlock |
| :- | :---- | :--- | :----- |
| 1 | English Grammar — Full Quiz | `/lock ENGL-1011 1` | `/unlock ENGL-1011 1` |

---

### 🌍 GEOG-1011 — Geography: Ethiopia and the Horn (8 Chapters)

| Ch | Title | Lock | Unlock |
| :- | :---- | :--- | :----- |
| 1 | Introduction, Location, Shape, Size and Map Reading | `/lock GEOG-1011 1` | `/unlock GEOG-1011 1` |
| 2 | Geology and Mineral Resources | `/lock GEOG-1011 2` | `/unlock GEOG-1011 2` |
| 3 | Topography of Ethiopia and the Horn | `/lock GEOG-1011 3` | `/unlock GEOG-1011 3` |
| 4 | Drainage Systems and Water Resources | `/lock GEOG-1011 4` | `/unlock GEOG-1011 4` |
| 5 | Climate of Ethiopia and the Horn | `/lock GEOG-1011 5` | `/unlock GEOG-1011 5` |
| 6 | Soils, Natural Vegetation and Wildlife | `/lock GEOG-1011 6` | `/unlock GEOG-1011 6` |
| 7 | Population of Ethiopia and the Horn | `/lock GEOG-1011 7` | `/unlock GEOG-1011 7` |
| 8 | Economic Activities in Ethiopia | `/lock GEOG-1011 8` | `/unlock GEOG-1011 8` |

---

### ➕ MATH-1011 — Mathematics for Natural Sciences (4 Chapters)

| Ch | Title | Lock | Unlock |
| :- | :---- | :--- | :----- |
| 1 | Propositional Logic and Set Theory | `/lock MATH-1011 1` | `/unlock MATH-1011 1` |
| 2 | The Real and Complex Number Systems | `/lock MATH-1011 2` | `/unlock MATH-1011 2` |
| 3 | Functions | `/lock MATH-1011 3` | `/unlock MATH-1011 3` |
| 4 | Analytic Geometry | `/lock MATH-1011 4` | `/unlock MATH-1011 4` |

---

### 🧠 PHIL-1011 — Logic and Critical Thinking (6 Chapters)

| Ch | Title | Lock | Unlock |
| :- | :---- | :--- | :----- |
| 1 | Introduction to Philosophy | `/lock PHIL-1011 1` | `/unlock PHIL-1011 1` |
| 2 | Basic Concepts of Logic | `/lock PHIL-1011 2` | `/unlock PHIL-1011 2` |
| 3 | Logic and Language | `/lock PHIL-1011 3` | `/unlock PHIL-1011 3` |
| 4 | Critical Thinking | `/lock PHIL-1011 4` | `/unlock PHIL-1011 4` |
| 5 | Logical Fallacies | `/lock PHIL-1011 5` | `/unlock PHIL-1011 5` |
| 6 | Categorical Propositions | `/lock PHIL-1011 6` | `/unlock PHIL-1011 6` |

---

### ⚡ PHYS-1011 — General Physics (6 Chapters)

| Ch | Title | Lock | Unlock |
| :- | :---- | :--- | :----- |
| 1 | Preliminaries | `/lock PHYS-1011 1` | `/unlock PHYS-1011 1` |
| 2 | Kinematics and Dynamics of Particles | `/lock PHYS-1011 2` | `/unlock PHYS-1011 2` |
| 3 | Fluid Mechanics | `/lock PHYS-1011 3` | `/unlock PHYS-1011 3` |
| 4 | Heat and Thermodynamics | `/lock PHYS-1011 4` | `/unlock PHYS-1011 4` |
| 5 | Oscillations, Waves and Optics | `/lock PHYS-1011 5` | `/unlock PHYS-1011 5` |
| 6 | Electromagnetism and Electronics | `/lock PHYS-1011 6` | `/unlock PHYS-1011 6` |

---

### 🧬 PSYC-1011 — General Psychology (11 Chapters)

| Ch | Title | Lock | Unlock |
| :- | :---- | :--- | :----- |
| 1 | Essence of Psychology | `/lock PSYC-1011 1` | `/unlock PSYC-1011 1` |
| 2 | Sensation and Perception | `/lock PSYC-1011 2` | `/unlock PSYC-1011 2` |
| 3 | Learning and Theories of Learning | `/lock PSYC-1011 3` | `/unlock PSYC-1011 3` |
| 4 | Memory and Forgetting | `/lock PSYC-1011 4` | `/unlock PSYC-1011 4` |
| 5 | Motivation and Emotions | `/lock PSYC-1011 5` | `/unlock PSYC-1011 5` |
| 6 | Personality | `/lock PSYC-1011 6` | `/unlock PSYC-1011 6` |
| 7 | Psychological Disorders and Treatment | `/lock PSYC-1011 7` | `/unlock PSYC-1011 7` |
| 8 | Introduction to Life Skills | `/lock PSYC-1011 8` | `/unlock PSYC-1011 8` |
| 9 | Intra-personal and Interpersonal Skills | `/lock PSYC-1011 9` | `/unlock PSYC-1011 9` |
| 10 | Academic Skills | `/lock PSYC-1011 10` | `/unlock PSYC-1011 10` |
| 11 | Social Skills | `/lock PSYC-1011 11` | `/unlock PSYC-1011 11` |

---

## 🗓️ Typical Weekly Workflow

### Start of Semester (Lock Everything)
```
/lockall
```

### Week 1 — Drop Chapter 1 Videos
```
/unlock ECON-1011 1
/unlock ENGL-1011 1
/unlock GEOG-1011 1
/unlock MATH-1011 1
/unlock PHIL-1011 1
/unlock PHYS-1011 1
/unlock PSYC-1011 1
```

### Week 2 — Drop Chapter 2 Videos
```
/unlock ECON-1011 2
/unlock GEOG-1011 2
/unlock MATH-1011 2
/unlock PHIL-1011 2
/unlock PHYS-1011 2
/unlock PSYC-1011 2
```

### Week 3 — Drop Chapter 3 Videos
```
/unlock ECON-1011 3
/unlock GEOG-1011 3
/unlock MATH-1011 3
/unlock PHIL-1011 3
/unlock PHYS-1011 3
/unlock PSYC-1011 3
```

### Revision Week (Open Everything)
```
/unlockall
```

---

## ❓ What Students See When a Chapter is Locked

- **On the Website:** The chapter card shows a `🔒 Locked` red badge. Clicking it shows:
  > *"🔒 Chapter X Quiz is Currently Locked! This quiz will be unlocked as soon as the video lecture is published in the private CSH Telegram group."*

- **On Telegram Bot:** The chapter button shows `🔒 Ch X: Title [Locked]`. Tapping it shows a popup alert with the same message.

- **Direct URL Access:** If a student tries to visit the quiz URL directly, they see a full locked screen with a link back to the course catalog.

---

## 🔑 Device Lock Reset (Anti-Sharing)

If a student switches to a new phone or new browser and gets blocked:

```
/resetdevice NT-XXXX
```

Or the student themselves can type this in the bot:
```
/resetdevice
```
The bot will verify their Telegram ID and clear their device lock automatically.

---

> **Note:** All lock/unlock changes take effect **instantly** on both the website and the Telegram bot — no restart needed.
