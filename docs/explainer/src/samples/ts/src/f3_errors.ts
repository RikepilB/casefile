import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  maxRetries: 2, // the default: retries 408, 409, 429, 5xx and network errors
  timeout: 60_000, // milliseconds in TypeScript (the Python SDK uses seconds)
});

export async function safeAsk(question: string): Promise<string | null> {
  try {
    const response = await client.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      messages: [{ role: "user", content: question }],
    });
    return response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");
  } catch (error) {
    // Most specific first. Each class means a different fix, so one
    // catch-all would hide which problem you actually have.
    if (error instanceof Anthropic.AuthenticationError) {
      throw new Error("The API key is wrong or missing. Retrying will not help.");
    }
    if (error instanceof Anthropic.RateLimitError) {
      // The SDK already retried twice. Tell the caller to slow down.
      return null;
    }
    if (error instanceof Anthropic.APIConnectionError) {
      return null; // network trouble: safe to try again later
    }
    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API error ${error.status}: ${error.message}`);
    }
    throw error; // not an API problem: a bug in our own code
  }
}
