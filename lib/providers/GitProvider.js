/**
 * GitProvider — the contract any git hosting platform must implement
 * to plug into the review bot.
 *
 * Today only GitHubProvider exists. Adding GitLab or Bitbucket later
 * means writing one new class that implements this same shape —
 * nothing else in the app needs to change.
 */
export class GitProvider {
  /** Verify the incoming webhook actually came from the provider. */
  async verifySignature(_rawBody, _signatureHeader) {
    throw new Error("verifySignature() not implemented");
  }

  /** Return true if this webhook payload is one we should review (e.g. PR opened/updated). */
  shouldReview(_payload) {
    throw new Error("shouldReview() not implemented");
  }

  /** Fetch the code diff/patch for the given pull request payload. */
  async getDiff(_payload) {
    throw new Error("getDiff() not implemented");
  }

  /** Post the AI-generated review back onto the pull request. */
  async postReview(_payload, _reviewText) {
    throw new Error("postReview() not implemented");
  }
}
