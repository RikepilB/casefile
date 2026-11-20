import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const stream = client.messages.stream({
  model: "claude-opus-5-5",
  max_tokens: 64000,
  messages: [{ role: "user", content: "Explain PDF export in two sentences." }],
});

// Fires once per chunk of text, as it arrives.
stream.on("text", (chunk) => {
  process.stdout.write(chunk);
});

// The SDK glues the chunks back into one normal Message for you.
// Why use it? You still need stop_reason and usage at the end.
const message = await stream.finalMessage();
console.log(`\nstop_reason: ${message.stop_reason}`);
console.log(`output tokens: ${message.usage.output_tokens}`);
