import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={`${styles.page} fade-in`}>
      <div className={styles.badgeRow}>
        <span className={styles.badge}>
          <span className={styles.dot} />
          LIVE
        </span>
        <span className={styles.prNumber}>#1 · opened by ai-review-bot</span>
      </div>

      <h1 className={styles.title}>AI Code Review Bot</h1>
      <p className={styles.subtitle}>
        A GitHub bot that reviews pull requests automatically. On every PR open or
        update, it fetches the diff, sends it to a fast free LLM (Groq), and posts
        the review as a comment — <b>bugs, code quality, missing tests, and nitpicks</b>,
        organized and specific.
      </p>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Files changed · core logic</div>

        <div className={styles.diffBlock}>
          <div className={styles.diffHeader}>
            <span>lib/providers/GitProvider.js</span>
            <span>abstract interface</span>
          </div>
          <div className={`${styles.diffLine} ${styles.neutral}`}>// any git host implements this contract</div>
          <div className={`${styles.diffLine} ${styles.add}`}>+ getDiff(payload)</div>
          <div className={`${styles.diffLine} ${styles.add}`}>+ postReview(payload, reviewText)</div>
        </div>

        <div className={styles.diffBlock}>
          <div className={styles.diffHeader}>
            <span>lib/providers/GitHubProvider.js</span>
            <span>implementation</span>
          </div>
          <div className={`${styles.diffLine} ${styles.add}`}>+ class GitHubProvider extends GitProvider</div>
          <div className={`${styles.diffLine} ${styles.neutral}`}>  uses Octokit to fetch diffs & post comments</div>
        </div>

        <div className={styles.diffBlock}>
          <div className={styles.diffHeader}>
            <span>app/api/webhook/route.js</span>
            <span>orchestration</span>
          </div>
          <div className={`${styles.diffLine} ${styles.neutral}`}>PR event → verify signature → getDiff → reviewDiff → postReview</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Example output</div>
        <div className={styles.comment}>
          <h3>🤖 AI Code Review</h3>
          <p><strong>Bugs / correctness</strong></p>
          <ul>
            <li>Off-by-one risk in the pagination loop in <code>utils/fetchPage.js</code> line 22.</li>
          </ul>
          <p><strong>Code quality</strong></p>
          <ul>
            <li>Consider extracting the retry logic into a shared helper — it's duplicated in two files.</li>
          </ul>
          <p><strong>Missing tests</strong></p>
          <ul>
            <li>No test covers the empty-response case for the new API call.</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Setup checklist</div>
        <ul className={styles.checklist}>
          <li className={styles.checkItem}>
            <span className={styles.checkIcon}>✓</span>
            <div>
              <div className={styles.checkTitle}>Get a free Groq API key</div>
              <div className={styles.checkDesc}>
                console.groq.com → create key → add as <code>GROQ_API_KEY</code>
              </div>
            </div>
          </li>
          <li className={styles.checkItem}>
            <span className={styles.checkIcon}>✓</span>
            <div>
              <div className={styles.checkTitle}>Create a GitHub personal access token</div>
              <div className={styles.checkDesc}>
                repo scope → add as <code>GITHUB_TOKEN</code>
              </div>
            </div>
          </li>
          <li className={styles.checkItem}>
            <span className={styles.checkIcon}>✓</span>
            <div>
              <div className={styles.checkTitle}>Deploy to Vercel</div>
              <div className={styles.checkDesc}>connect this repo, add the env vars, deploy</div>
            </div>
          </li>
          <li className={styles.checkItem}>
            <span className={styles.checkIcon}>✓</span>
            <div>
              <div className={styles.checkTitle}>Add the webhook to your target repo</div>
              <div className={styles.checkDesc}>
                Settings → Webhooks → Payload URL: <code>your-app.vercel.app/api/webhook</code>, content type{" "}
                <code>application/json</code>, secret matches <code>GITHUB_WEBHOOK_SECRET</code>, event:{" "}
                <code>Pull requests</code>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div className={styles.links}>
        <a
          className={styles.linkBtn}
          href="https://github.com/Priyanka-Durgam/ai-code-review-bot/pull/1"
          target="_blank"
          rel="noreferrer"
        >
          See live PR review ↗
        </a>
        <a
          className={styles.linkBtn}
          href="https://github.com/Priyanka-Durgam/ai-code-review-bot"
          target="_blank"
          rel="noreferrer"
        >
          View source ↗
        </a>
      </div>

      <div className={styles.footer}>Built with Next.js, Groq, and the GitHub API.</div>
    </main>
  );
}
