# AI Code Review Bot

A GitHub bot that automatically reviews pull requests using AI. When a PR is opened or updated, the bot fetches the diff, sends it to Groq (Llama 3.3), and posts a structured review comment — covering bugs, code quality, missing tests, and nitpicks.

| | |
|---|---|
| **Live app** | [ai-code-review-bot-zeta.vercel.app](https://ai-code-review-bot-zeta.vercel.app) |
| **Sample output** | [PR #1](https://github.com/Priyanka-Durgam/ai-code-review-bot/pull/1) — bot-posted review comment |
| **Webhook health** | [/api/webhook](https://ai-code-review-bot-zeta.vercel.app/api/webhook) |

---

## Features

- **Automated PR reviews** — triggers on PR open, update, or reopen
- **Structured feedback** — bugs, code quality, missing tests, and nitpicks in markdown
- **Secure webhooks** — HMAC-SHA256 signature verification before processing any payload
- **Provider-agnostic design** — git hosting logic behind a `GitProvider` interface; GitHub implemented today, other hosts are a single adapter class away
- **Large-diff handling** — truncates oversized diffs before sending to the LLM (token limit constraint)
- **Serverless deployment** — runs on Vercel with zero server management

---

## How it works

```
PR opened/updated on GitHub
        │
        ▼
GitHub sends webhook POST → /api/webhook
        │
        ▼
Verify HMAC signature (GITHUB_WEBHOOK_SECRET)
        │
        ▼
Fetch PR diff via GitHub API (Octokit + GITHUB_TOKEN)
        │
        ▼
Send diff to Groq LLM with a review prompt
        │
        ▼
Post AI review as a PR comment
```

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 13 (App Router) |
| LLM | Groq API — `llama-3.3-70b-versatile` |
| GitHub integration | Octokit (`@octokit/rest`) |
| Hosting | Vercel (serverless) |
| Language | Node.js / JavaScript |

---

## Project structure

```
app/
  page.js                     Landing page
  api/webhook/route.js        Webhook endpoint — orchestrates the review
lib/
  review.js                   Calls Groq to generate the review text
  providers/
    GitProvider.js            Interface every git host must implement
    GitHubProvider.js         GitHub implementation (Octokit)
```

---

## Setup

### 1. Local development

```bash
git clone https://github.com/Priyanka-Durgam/ai-code-review-bot.git
cd ai-code-review-bot
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Where to get it |
|----------|-----------------|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) → API Keys (free tier) |
| `GITHUB_TOKEN` | [github.com/settings/tokens](https://github.com/settings/tokens) → classic token with `repo` scope |
| `GITHUB_WEBHOOK_SECRET` | Any random string you create (must match the GitHub webhook secret) |

```bash
npm run dev
```

Visit `http://localhost:3000` (or the port shown in the terminal).

### 2. Deploy to Vercel

1. Sign in at [vercel.com](https://vercel.com) with GitHub
2. **Add New Project** → import `ai-code-review-bot`
3. Add the three environment variables from `.env.local`
4. Deploy

### 3. Configure the GitHub webhook

On any repo you want the bot to review:

1. **Settings → Webhooks → Add webhook**
2. **Payload URL:** `https://ai-code-review-bot-zeta.vercel.app/api/webhook`
3. **Content type:** `application/json`
4. **Secret:** same value as `GITHUB_WEBHOOK_SECRET`
5. **Events:** **Pull requests** only
6. Save

### 4. Test

Open a pull request (even a one-line change). Within a few seconds, a **AI Code Review** comment should appear on the PR.

---

## Key design decisions

**GitProvider abstraction** — Git hosting logic is behind an interface, not hard-coded to GitHub. Adding GitLab or Bitbucket means implementing one adapter class; the webhook handler and review logic stay unchanged.

**Webhook security** — Every incoming request is verified with HMAC-SHA256 using a shared secret before any payload is trusted or processed.

**Diff truncation** — Diffs longer than 12,000 characters are truncated before hitting the LLM, a real constraint driven by token limits on the free tier.

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | Groq API key for LLM inference |
| `GITHUB_TOKEN` | Yes | PAT with `repo` scope — fetch diffs and post comments |
| `GITHUB_WEBHOOK_SECRET` | Yes | Shared secret for webhook signature verification |

---

## License

MIT
