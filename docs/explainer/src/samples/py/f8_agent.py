"""An agent Anthropic hosts, with a human-style approval rule."""

import anthropic

client = anthropic.Anthropic()

# ---- Run once, at setup. Save the IDs; do not recreate per request. ----
environment = client.beta.environments.create(
    name="casefile-env",
    config={
        "type": "cloud",
        "networking": {"type": "limited", "allow_package_managers": True, "allow_mcp_servers": True},
    },
)

agent = client.beta.agents.create(
    name="Casefile Investigator",
    model="claude-opus-5-5",
    system="Investigate support cases. Record evidence with its source. Never send anything to a customer.",
    mcp_servers=[{"type": "url", "name": "casefile", "url": "https://casefile.example.com/mcp"}],
    tools=[
        {
            "type": "agent_toolset_20260401",
            "default_config": {"enabled": True, "permission_policy": {"type": "auto"}},
            "configs": [
                {"name": "web_fetch", "enabled": False},
                {"name": "web_search", "enabled": False},
            ],
        },
        # MCP tools pause for approval by default. Keep it that way.
        {"type": "mcp_toolset", "mcp_server_name": "casefile"},
    ],
)

# ---- Run for every case. ----
READ_ONLY = {"casefile_get_ticket", "casefile_find_similar_tickets", "casefile_get_case"}


def investigate(ticket_id: str) -> None:
    """Run one investigation session and print what the agent says.

    Args:
        ticket_id: The ticket to investigate, for example T-1001.
    """
    session = client.beta.sessions.create(
        agent={"type": "agent", "id": agent.id, "version": agent.version},
        environment_id=environment.id,
    )

    # Open the stream first, or you miss the earliest events.
    with client.beta.sessions.events.stream(session_id=session.id) as stream:
        client.beta.sessions.events.send(
            session_id=session.id,
            events=[
                {
                    "type": "user.message",
                    "content": [{"type": "text", "text": f"Investigate ticket {ticket_id}."}],
                }
            ],
        )
        for event in stream:
            if event.type == "agent.message":
                for block in event.content:
                    if block.type == "text":
                        print(block.text, end="", flush=True)
            elif event.type == "agent.mcp_tool_use" and event.evaluated_permission == "ask":
                # Our rule: reading is fine, anything that writes is denied
                # here and goes to a person. Never answer "allow" to everything.
                client.beta.sessions.events.send(
                    session_id=session.id,
                    events=[
                        {
                            "type": "user.tool_confirmation",
                            "tool_use_id": event.id,
                            "result": "allow" if event.name in READ_ONLY else "deny",
                        }
                    ],
                )
            elif event.type == "session.status_idle":
                # "requires_action" means it is waiting on us: keep listening.
                if event.stop_reason.type != "requires_action":
                    return
            elif event.type == "session.status_terminated":
                return
