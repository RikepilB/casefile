import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// ---- Run once, at setup. Save the IDs; do not recreate per request. ----
const environment = await client.beta.environments.create({
  name: "casefile-env",
  config: {
    type: "cloud",
    networking: { type: "limited", allow_package_managers: true, allow_mcp_servers: true },
  },
});

const agent = await client.beta.agents.create({
  name: "Casefile Investigator",
  model: "claude-opus-5-5",
  system: "Investigate support cases. Record evidence with its source. Never send anything to a customer.",
  mcp_servers: [{ type: "url", name: "casefile", url: "https://casefile.example.com/mcp" }],
  tools: [
    {
      type: "agent_toolset_20260401",
      default_config: { enabled: true, permission_policy: { type: "auto" } },
      configs: [
        { name: "web_fetch", enabled: false },
        { name: "web_search", enabled: false },
      ],
    },
    // MCP tools pause for approval by default. Keep it that way.
    { type: "mcp_toolset", mcp_server_name: "casefile" },
  ],
});

// ---- Run for every case. ----
const READ_ONLY = new Set(["casefile_get_ticket", "casefile_find_similar_tickets", "casefile_get_case"]);

export async function investigate(ticketId: string): Promise<void> {
  const session = await client.beta.sessions.create({
    agent: { type: "agent", id: agent.id, version: agent.version },
    environment_id: environment.id,
  });

  // Open the stream first, or you miss the earliest events.
  const stream = await client.beta.sessions.events.stream(session.id);
  await client.beta.sessions.events.send(session.id, {
    events: [{ type: "user.message", content: [{ type: "text", text: `Investigate ticket ${ticketId}.` }] }],
  });

  for await (const event of stream) {
    if (event.type === "agent.message") {
      for (const block of event.content) {
        if (block.type === "text") process.stdout.write(block.text);
      }
    } else if (
      (event.type === "agent.mcp_tool_use" || event.type === "agent.tool_use") &&
      event.evaluated_permission === "ask"
    ) {
      // Both kinds of tool can stop and ask: your MCP tools, and the
      // built-in ones when the "auto" policy is not sure. Every ask needs
      // an answer, or the session waits forever.
      // Our rule: reading your own tickets is fine. Everything else is
      // denied here and goes to a person. Never answer "allow" to everything.
      const readOnly = event.type === "agent.mcp_tool_use" && READ_ONLY.has(event.name);
      await client.beta.sessions.events.send(session.id, {
        events: [
          {
            type: "user.tool_confirmation",
            tool_use_id: event.id,
            result: readOnly ? "allow" : "deny",
          },
        ],
      });
    } else if (event.type === "session.status_idle") {
      // "requires_action" means it is waiting on us, so keep listening.
      if (event.stop_reason.type !== "requires_action") return;
    } else if (event.type === "session.status_terminated") {
      return;
    }
  }
}
