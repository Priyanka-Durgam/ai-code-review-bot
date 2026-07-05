export const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile"; // fast + free on Groq

const SYSTEM_PROMPT = `You are an experienced senior software engineer doing a pull request code review.
Review the given diff and provide feedback as a short, well-organized markdown comment covering:

1. **Bugs / correctness issues** — anything that looks wrong or risky
2. **Code quality** — naming, structure, duplication, readability
3. **Missing tests** — call out untested logic if it's obvious from the diff
4. **Nitpicks** — small style suggestions (keep this section short)

Rules:
- Be specific: reference file names and line context from the diff when possible.
- Be concise. Use bullet points, not paragraphs.
- If the diff genuinely looks good, say so plainly instead of inventing issues.
- Never repeat the full diff back.`;

// Diffs can get huge; keep the prompt within a safe size for the free tier.
const MAX_DIFF_CHARS = 12000;

export async function reviewDiff(diff) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY. Add it to your .env.local file (see README).");
  }

  const truncatedDiff =
    diff.length > MAX_DIFF_CHARS
      ? diff.slice(0, MAX_DIFF_CHARS) + "\n\n... (diff truncated for length)"
      : diff;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Here is the pull request diff:\n\n\`\`\`diff\n${truncatedDiff}\n\`\`\`` },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

