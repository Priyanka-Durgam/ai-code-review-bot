import { NextResponse } from "next/server";
import { GitHubProvider } from "../../../lib/providers/GitHubProvider";
import { reviewDiff } from "../../../lib/review";

// Today we only wire up GitHub. Swapping/adding a provider means
// implementing GitProvider and choosing it here based on the request —
// nothing below this line needs to change.
function getProvider() {
  return new GitHubProvider();
}

export async function POST(req) {
  const provider = getProvider();

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-hub-signature-256");
    const event = req.headers.get("x-github-event");

    const isValid = await provider.verifySignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (event !== "pull_request") {
      return NextResponse.json({ message: `Ignored event: ${event}` });
    }

    const payload = JSON.parse(rawBody);

    if (!provider.shouldReview(payload)) {
      return NextResponse.json({ message: `Ignored action: ${payload.action}` });
    }

    const diff = await provider.getDiff(payload);
    const review = await reviewDiff(diff);
    await provider.postReview(payload, review);

    return NextResponse.json({ message: "Review posted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Something went wrong." },
      { status: 500 }
    );
  }
}

// GitHub sends a GET-friendly ping on setup sometimes; respond simply.
export async function GET() {
  return NextResponse.json({ status: "AI Code Review Bot webhook is live." });
}
