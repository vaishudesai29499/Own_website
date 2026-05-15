# Own_website
# 🧠 AI Job Hub

A full-stack production web app for discovering AI jobs, daily AI news, blog posts from Medium, and an interactive AI quiz.

---

## 🚀 Features

| Feature | Details |
|---|---|
| 💼 **AI Jobs** | 8 categories: Data Annotation, Prompt Engineering, AI Training, AI Evaluation, MLOps, NLP, Computer Vision, AI Research |
| 📰 **AI News** | Auto-fetched every 6 hours from NewsAPI (100+ articles) |
| ✍️ **Blog** | Your Medium posts via RSS, synced daily |
| 🎯 **AI Quiz** | 50 questions, 5 categories, timer, hints, scoring |
| ⚙️ **Cron Jobs** | Automated data refresh via node-cron in custom server |

---

## 📦 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```env
NEWSAPI_KEY=19dadafb959c408fae16eee8609fb48f   # already set
MEDIUM_USERNAME=vaishnavidesai29
RAPIDAPI_KEY=                                   # optional
```

### 3. Run development server
```bash
npm run dev
```
Open → http://localhost:3000

### 4. Build for production
```bash
npm run build
npm start
```

---

## 🗂️ Project Structure

```
aijobhub/
├── server.js              ← Custom Next.js server + cron scheduler
├── cron/
│   ├── newsCron.js        ← NewsAPI fetch (every 6h)
│   ├── jobsCron.js        ← RemoteOK + Arbeitnow fetch (every 12h)
│   └── blogCron.js        ← Medium RSS fetch (every 24h)
├── data/                  ← Auto-generated JSON storage
│   ├── news.json
│   ├── blog.json
│   └── jobs/
├── src/
│   ├── app/
│   │   ├── page.js        ← Home
│   │   ├── jobs/          ← Jobs listing + category pages
│   │   ├── news/          ← News feed
│   │   ├── blog/          ← Medium blog
│   │   ├── quiz/          ← Interactive quiz
│   │   └── api/           ← REST API routes
│   ├── components/        ← Reusable UI components
│   ├── lib/               ← Server utilities
│   └── data/              ← Static quiz questions
└── .env.local             ← Your API keys
```

---

## 🔌 APIs Used (All Free)

| API | Purpose | Key Required |
|---|---|---|
| [NewsAPI](https://newsapi.org) | AI news articles | Yes (free tier) |
| [RemoteOK](https://remoteok.com/api) | Remote AI jobs | No |
| [Arbeitnow](https://www.arbeitnow.com/api) | More AI jobs | No |
| Medium RSS | Blog posts | No (just username) |

---

## ⏰ Cron Schedule

| Task | Frequency | Manual Trigger |
|---|---|---|
| News fetch | Every 6 hours | `POST /api/cron-trigger?type=news` |
| Jobs fetch | Every 12 hours | `POST /api/cron-trigger?type=jobs` |
| Blog fetch | Daily at 8am | `POST /api/cron-trigger?type=blog` |
| All | — | `POST /api/cron-trigger?type=all` |

---

## 📋 Job Categories

- 📝 Data Annotation
- 🤖 Prompt Engineering
- 🧠 AI Training
- ⚖️ AI Evaluation
- 🔧 MLOps
- 💬 NLP / Text AI
- 👁️ Computer Vision
- 🔬 AI Research

---

## 🎯 Quiz Categories

- 🤖 Machine Learning (10 questions)
- 🧠 Deep Learning (10 questions)
- 💬 NLP & LLMs (10 questions)
- ✨ Prompt Engineering (10 questions)
- ⚖️ AI Ethics (10 questions)

---

## 🛠️ Tech Stack

- **Next.js 14** – App Router, API Routes
- **Tailwind CSS** – Styling
- **node-cron** – Scheduled jobs
- **axios** – HTTP requests
- **xml2js** – RSS parsing

---

## 🐛 Troubleshooting

**No jobs showing?** Jobs are fetched on startup and every 12h. Wait or trigger manually:
```bash
curl -X POST http://localhost:3000/api/cron-trigger?type=jobs
```

**No news showing?** Check your `NEWSAPI_KEY` in `.env.local`.

**No blog posts?** Set `MEDIUM_USERNAME` in `.env.local` to your Medium username (without @).

**Port already in use?** Set `PORT=3001` in `.env.local`.
