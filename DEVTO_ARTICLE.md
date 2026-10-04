---
title: Idea Board — Turn 3 AM Idea Overload into Actionable 30-Minute Tasks with Local AI
published: true
tags: devchallenge, weekendchallenge, hf26challenge, ai
canonical_url: https://dev.to/challenges/hacktoberfest-weekend-2026-10-01
---

*This is a submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

---

## What I Built

I built **Idea Board** for my best friend who suffers from severe "3 AM idea overload." He constantly wakes up with ambitious side-project ideas, writes down vague goals like *"Learn AI vectors"* or *"Build a search engine,"* but gets completely overwhelmed trying to figure out where to start. Within a few days, those ideas die in his notes app clutter.

**Idea Board** solves this by converting any vague goal or project idea into a structured, step-by-step Kanban task board in seconds. Each generated task is concrete, starts with an action verb, and is strictly capped at 15 to 60 minutes so he can make real progress in bite-sized sessions without feeling overwhelmed.

---

## Demo

### Video Demo
https://github.com/user-attachments/assets/ideaBoard.mp4

> **Note**: Video demo is also stored in the codebase at `frontend/public/ideaBoard.mp4`.

### Screenshots

#### Dark Notebook Kanban Board View
![Idea Board Main View](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/idea-board/frontend/public/front.png)

#### Generated Task Breakdown
![Task List View](https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/idea-board/frontend/public/tasklist.png)

---

## Code

{% github YOUR_USERNAME/YOUR_REPO %}

---

## How I Built It

Idea Board is built with local open-source AI at its core:
- **Local AI Inference Engine**: Powered by **Ollama** running the open-weight **`qwen2.5:3b`** model locally at `http://localhost:11434`.
- **Backend**: Built with **FastAPI** (Python 3.10+), **SQLAlchemy**, **SQLite**, and **`httpx`** for async local REST calls to Ollama.
- **Frontend**: A custom React (Vite) application styled with **Tailwind CSS** using a dark notebook aesthetic with hand-drawn *Patrick Hand SC* typography, interactive HTML5 drag-and-drop Kanban columns (**To do**, **Doing**, **Done**), progress bar tracking, and batch text import.

---

## Why Does Open Innovation Matter?

1. **100% Privacy & Zero Server Leakage**: My friend doesn't want his raw startup ideas or personal notes sent to third-party cloud LLM APIs or used to train corporate models. Running `qwen2.5:3b` locally via Ollama keeps all data strictly on his machine.
2. **Runs Offline on a Laptop**: It requires zero internet connection. He can work on airplane rides or in cafes without relying on cloud availability or API latency.
3. **Zero Subscription Fees**: Closed API subscriptions add up fast. Open-weight models running locally cost **$0** per prompt.
4. **Full System Control**: Open innovation allowed me to fine-tune the system prompt and strict formatting rules without API guardrail interference or rate limits.

---

## My Friend's Reaction

> *"Man, this is literally what I needed. I plugged in 'Learn vectors for AI' with 1 hour/day, and having 30-minute micro-tasks right in front of me on a dark notebook board made starting feel effortless instead of intimidating."*

---

## My Agent Session

I used an agentic pair-programmer during the hackathon to build, test, and style this full-stack application.

---

## Prize Categories

- **Build for a Friend**

---

## ⚡ Setup & Quick Start

### Prerequisites
1. **Python 3.10+**
2. **Node.js 18+** & `npm`
3. **Ollama** running locally with `qwen2.5:3b`:
   ```bash
   ollama pull qwen2.5:3b
   ```

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
