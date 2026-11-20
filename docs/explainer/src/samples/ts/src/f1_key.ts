"use server"; // Next.js: code in this file only ever runs on your server

import Anthropic from "@anthropic-ai/sdk";

// new Anthropic() reads ANTHROPIC_API_KEY from the server's environment.
// Why not write the key here? Source code ends up in git history, and
// anyone who can read the repo could then spend your money.
const client = new Anthropic();

export async function askClaude(question: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    messages: [{ role: "user", content: question }],
  });

  // The reply is a list of blocks, not one string. Keep the text blocks.
  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");
}
