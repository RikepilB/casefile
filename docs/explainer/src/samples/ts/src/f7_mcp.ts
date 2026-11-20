import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";

// Stand-in for your real ticket store.
const tickets = new Map([
  ["T-1001", { id: "T-1001", subject: "PDF export fails for large invoices", status: "open" }],
]);

const server = new McpServer({ name: "casefile", version: "0.1.0" });

server.registerTool(
  "casefile_get_ticket",
  {
    description: "Get one support ticket by its ID, for example T-1001.",
    inputSchema: z.object({ ticket_id: z.string() }),
  },
  async ({ ticket_id }) => {
    const ticket = tickets.get(ticket_id);
    if (!ticket) {
      // An error Claude can act on: it says what to do next.
      return {
        isError: true,
        content: [{ type: "text", text: `Unknown ticket "${ticket_id}". Search for valid IDs first.` }],
      };
    }
    return { content: [{ type: "text", text: JSON.stringify(ticket) }] };
  },
);

// stdio: the Claude app starts this program and talks to it over
// stdin and stdout. Nothing listens on the network.
await server.connect(new StdioServerTransport());
