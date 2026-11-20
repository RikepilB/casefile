import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// Claude keeps nothing between calls, so the conversation lives here.
// In a real app this Map is a database table keyed by conversation ID.
const conversations = new Map<string, Anthropic.MessageParam[]>();

export async function reply(conversationId: string, userText: string): Promise<string> {
  const history = conversations.get(conversationId) ?? [];
  history.push({ role: "user", content: userText });

  const response = await client.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    messages: history, // the whole conversation, every time
  });

  // Store the full content, not only the text. Later turns need the
  // exact blocks Claude produced, or the history no longer matches.
  history.push({ role: "assistant", content: response.content });
  conversations.set(conversationId, history);

  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");
}

// Deleting is your job too: nothing else holds this conversation.
export function forget(conversationId: string): void {
  conversations.delete(conversationId);
}
