import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const MODEL = "claude-opus-5-5";

// Imagine this is a long labelling guide: thousands of tokens that are
// identical on every request. That sameness is what makes caching pay.
const GUIDE = "You label support tickets for Acme Invoices. (…long guide…)";
const messages: Anthropic.MessageParam[] = [
  { role: "user", content: "<ticket>\nPDF export hangs at 90%.\n</ticket>" },
];

// 1. Ask how big the request is before you send it.
const count = await client.messages.countTokens({ model: MODEL, system: GUIDE, messages });
console.log(`This request is ${count.input_tokens} input tokens.`);

// 2. Send it, marking the guide as cacheable. Why mark only the guide?
// Caching matches from the start of the request, so the part that
// never changes goes first and the part that changes goes after.
const response = await client.messages.create({
  model: MODEL,
  max_tokens: 2048,
  system: [{ type: "text", text: GUIDE, cache_control: { type: "ephemeral" } }],
  messages,
});

// 3. Read the receipt. Dollars per million tokens for this model:
// input 4, cache write 5 (1.25x input), cache read 0.20 (0.05x input), output 20.
const usage = response.usage;
const dollars =
  (usage.input_tokens * 4 +
    (usage.cache_creation_input_tokens ?? 0) * 5 +
    (usage.cache_read_input_tokens ?? 0) * 0.2 +
    usage.output_tokens * 20) /
  1_000_000;
console.log(`Cache read: ${usage.cache_read_input_tokens ?? 0} tokens. Cost: $${dollars.toFixed(4)}`);
