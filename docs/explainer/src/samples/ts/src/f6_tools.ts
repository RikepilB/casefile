import Anthropic from "@anthropic-ai/sdk";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

const client = new Anthropic();

// Stand-in for your real database query.
async function findTickets(query: string): Promise<{ id: string; subject: string }[]> {
  const tickets = [
    { id: "T-1001", subject: "PDF export fails for large invoices" },
    { id: "T-1002", subject: "Export to PDF spins forever" },
  ];
  return tickets.filter((t) => t.subject.toLowerCase().includes(query.toLowerCase()));
}

// The description is what Claude reads to decide when to use the tool.
// A vague description is the most common reason a tool never gets called.
const searchTickets = betaZodTool({
  name: "search_tickets",
  description: "Search support tickets by words in the subject. Returns id and subject.",
  inputSchema: z.object({ query: z.string().describe("Words to look for") }),
  // This function runs on YOUR machine. Claude only ever sees what it returns.
  run: async ({ query }) => JSON.stringify(await findTickets(query)),
});

// The tool runner repeats "ask Claude, run the tool, send the result back"
// until Claude answers without asking for another tool.
const finalMessage = await client.beta.messages.toolRunner({
  model: "claude-opus-5-5",
  max_tokens: 16000,
  tools: [searchTickets],
  messages: [{ role: "user", content: "Are other tickets like T-1001 about PDF export?" }],
});

for (const block of finalMessage.content) {
  if (block.type === "text") console.log(block.text);
}
