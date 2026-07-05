import styles from "./page.module.css";

const LINKS = {
  livePr: "https://github.com/Priyanka-Durgam/ai-code-review-bot/pull/1",
  source: "https://github.com/Priyanka-Durgam/ai-code-review-bot",
  webhook: "https://ai-code-review-bot-zeta.vercel.app/api/webhook",
};

export default function Home() {
  return (
    <main className={`${styles.page} fade-in`}>
      <div className={styles.badgeRow}>
        <span className={styles.badge}>
          <span className={styles.dot} />
          Live
        </span>
        <span className={styles.meta}>Next.js · Groq · Vercel</span>
      </div>

      <h1 className={styles.title}>AI Code Review Bot</h1>
      <p className={styles.subtitle}>
        GitHub webhook service that reviews pull requests with Groq LLM and posts
        structured feedback on bugs, code quality, missing tests, and nitpicks.
      </p>

      <div className={styles.links}>
        <a className={styles.linkBtnPrimary} href={LINKS.livePr} target="_blank" rel="noreferrer">
          View live PR review ↗
        </a>
        <a className={styles.linkBtn} href={LINKS.source} target="_blank" rel="noreferrer">
          Source code ↗
        </a>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Architecture</div>

        <div className={styles.diffBlock}>
          <div className={styles.diffHeader}>
            <span>lib/providers/GitProvider.js</span>
            <span>interface</span>
          </div>
          <div className={`${styles.diffLine} ${styles.neutral}`}>// contract for any git host</div>
          <div className={`${styles.diffLine} ${styles.add}`}>+ getDiff(payload)</div>
          <div className={`${styles.diffLine} ${styles.add}`}>+ postReview(payload, reviewText)</div>
        </div>

        <div className={styles.diffBlock}>
          <div className={styles.diffHeader}>
            <span>lib/providers/GitHubProvider.js</span>
            <span>implementation</span>
          </div>
          <div className={`${styles.diffLine} ${styles.add}`}>+ class GitHubProvider extends GitProvider</div>
          <div className={`${styles.diffLine} ${styles.neutral}`}>  Octokit — fetch diffs, post comments</div>
        </div>

        <div className={styles.diffBlock}>
          <div className={styles.diffHeader}>
            <span>app/api/webhook/route.js</span>
            <span>orchestration</span>
          </div>
          <div className={`${styles.diffLine} ${styles.neutral}`}>
            PR event → verify signature → getDiff → reviewDiff → postReview
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Sample review output</div>
        <div className={styles.comment}>
          <h3>🤖 AI Code Review</h3>
          <p><strong>Bugs / correctness</strong></p>
          <ul>
            <li>Off-by-one risk in the pagination loop in <code>utils/fetchPage.js</code> line 22.</li>
          </ul>
          <p><strong>Code quality</strong></p>
          <ul>
            <li>Consider extracting the retry logic into a shared helper — duplicated in two files.</li>
          </ul>
          <p><strong>Missing tests</strong></p>
          <ul>
            <li>No test covers the empty-response case for the new API call.</li>
          </ul>
        </div>
        <p className={styles.sampleNote}>
          Illustrative example. See the{" "}
          <a href={LINKS.livePr} target="_blank" rel="noreferrer">
            live review on PR #1
          </a>
          .
        </p>
      </div>

      <div className={styles.footer}>
        <span>Webhook endpoint</span>
        <a href={LINKS.webhook} target="_blank" rel="noreferrer">
          /api/webhook
        </a>
      </div>
    </main>
  );
}
