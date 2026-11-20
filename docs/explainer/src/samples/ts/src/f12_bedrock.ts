import Anthropic from "@anthropic-ai/sdk";
import { AnthropicBedrockMantle } from "@anthropic-ai/bedrock-sdk";

// No Anthropic API key anywhere. The client signs each request with the
// AWS credentials already on this machine (a role, SSO, or ~/.aws/credentials).
const client = new AnthropicBedrockMantle({ awsRegion: "us-east-1" });

const response = await client.messages.create({
  // Bedrock model IDs carry an "anthropic." prefix.
  model: "anthropic.claude-opus-5-5",
  max_tokens: 16000,
  messages: [{ role: "user", content: "What does a 'pending' ticket mean?" }],
});

// From here on, the code is identical to calling Anthropic directly.
const text = response.content
  .filter((block): block is Anthropic.TextBlock => block.type === "text")
  .map((block) => block.text)
  .join("");
console.log(text);
