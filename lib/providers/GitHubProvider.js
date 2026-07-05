import { Octokit } from "@octokit/rest";
import crypto from "crypto";
import { GitProvider } from "./GitProvider.js";

export class GitHubProvider extends GitProvider {
  constructor() {
    super();
    this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    this.webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
  }

  async verifySignature(rawBody, signatureHeader) {
    if (!this.webhookSecret) {
      throw new Error("Missing GITHUB_WEBHOOK_SECRET");
    }
    if (!signatureHeader) return false;

    const expected =
      "sha256=" +
      crypto.createHmac("sha256", this.webhookSecret).update(rawBody).digest("hex");

    const expectedBuf = Buffer.from(expected);
    const receivedBuf = Buffer.from(signatureHeader);

    if (expectedBuf.length !== receivedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, receivedBuf);
  }

  shouldReview(payload) {
    return (
      payload.action === "opened" ||
      payload.action === "synchronize" ||
      payload.action === "reopened"
    );
  }

  async getDiff(payload) {
    const { owner, repo, pull_number } = this._prCoords(payload);
    const { data } = await this.octokit.pulls.get({
      owner,
      repo,
      pull_number,
      mediaType: { format: "diff" },
    });
    // When format is "diff", Octokit returns the raw diff string as `data`
    return typeof data === "string" ? data : JSON.stringify(data);
  }

  async postReview(payload, reviewText) {
    const { owner, repo, pull_number } = this._prCoords(payload);
    return this.octokit.issues.createComment({
      owner,
      repo,
      issue_number: pull_number,
      body: `### 🤖 AI Code Review\n\n${reviewText}`,
    });
  }

  _prCoords(payload) {
    return {
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      pull_number: payload.pull_request.number,
    };
  }
}
