# 🤖 AI Code Review Bot

A GitHub bot that automatically reviews pull requests using AI. When a PR is
opened or updated, the bot fetches the diff, sends it to a free/fast LLM
(Groq), and posts a structured review comment covering bugs, code quality,
missing tests, and nitpicks.

Built to be **provider-agnostic**: git hosting logic sits behind a
`GitProvider` interface (`lib/providers/GitProvider.js`). Today only GitHub
is implemented (`GitHubProvider.js`), but adding GitLab/Bitbucket later means
writing one new adapter class — nothing else changes.

## How it works

```
PR opened/updated on GitHub
        │
        ▼
GitHub sends a webhook → /api/webhook
        │
        ▼
Verify webhook signature (GITHUB_WEBHOOK_SECRET)
        │
        ▼
Fetch the PR diff (GitHub API via Octokit)
        │
        ▼
Send diff to Groq LLM with a review prompt
        │
        ▼
Post the AI's review as a PR comment (GitHub API)
```

## Tech stack

- **Next.js** (App Router) — API route handles the webhook, also serves a landing page
- **Groq API** — free, very fast LLM inference for generating the review
- **Octokit** — GitHub's official SDK, used to fetch diffs and post comments
- **Vercel** — free hosting, deploys straight from GitHub

---

## 1. Local setup

```bash
cd AI_Project01
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Where to get it |
|---|---|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) → API Keys → Create key (free) |
| `GITHUB_TOKEN` | [github.com/settings/tokens](https://github.com/settings/tokens) → Generate new token (classic) → check the `repo` scope |
| `GITHUB_WEBHOOK_SECRET` | Make up any random string yourself, e.g. `openssl rand -hex 20` |

Run it locally:

```bash
npm run dev
```

Visit `http://localhost:3000` — you should see the project landing page.

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: AI code review bot"
git branch -M main
git remote add origin https://github.com/Priyanka-Durgam/ai-code-review-bot.git
git push -u origin main
```

(Create the empty repo first at github.com/new, name it `ai-code-review-bot`,
**do not** initialize it with a README so the push above doesn't conflict.)

## 3. Deploy to Vercel (free)

1. Go to [vercel.com](https://vercel.com) → sign in with GitHub
2. **Add New Project** → import `ai-code-review-bot`
3. Under **Environment Variables**, add the same 3 variables from `.env.local`
4. Deploy — you'll get a live URL like `https://ai-code-review-bot.vercel.app`

## 4. Point a repo's webhook at your bot

On any repo you want the bot to review (can be a test repo you make):

1. Repo → **Settings → Webhooks → Add webhook**
2. **Payload URL:** `https://ai-code-review-bot.vercel.app/api/webhook`
3. **Content type:** `application/json`
4. **Secret:** the same value as `GITHUB_WEBHOOK_SECRET`
5. **Events:** select just **Pull requests**
6. Save

## 5. Test it

Open a pull request on that repo (even a trivial one-line change). Within a
few seconds you should see a comment from the bot with its review.

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

## Notes for your resume / interviews

- Talk about the `GitProvider` abstraction — it's a clean example of
  programming to an interface rather than a concrete implementation.
- The webhook handler verifies HMAC signatures before trusting any payload —
  worth mentioning if asked about securing webhooks.
- Large diffs are truncated before hitting the LLM — a real constraint you
  had to design around (token limits), not just an API call.

<!-- test PR for AI review bot -->
