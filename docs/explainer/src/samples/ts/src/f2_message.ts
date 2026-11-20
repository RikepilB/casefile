import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-opus-5-5",
  // A ceiling, not a target: you pay for tokens produced, not for the limit.
  max_tokens: 16000,
  system: "You are a support assistant for Acme Invoices. Be brief.",
  messages: [{ role: "user", content: "What does a 'pending' ticket mean?" }],
});

// Always look at why Claude stopped before trusting the answer.
// "max_tokens" means it was cut off; "refusal" means it declined.
if (response.stop_reason !== "end_turn") {
  throw new Error(`Unexpected stop: ${response.stop_reason}`);
}

for (const block of response.content) {
  if (block.type === "text") console.log(block.text);
}

// Prices are per million tokens: $4 in, $20 out for this model.
const { input_tokens, output_tokens } = response.usage;
const dollars = (input_tokens * 4 + output_tokens * 20) / 1_000_000;
console.log(`This call cost about $${dollars.toFixed(4)}`);
