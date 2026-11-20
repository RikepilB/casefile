"""A tiny MCP server with one tool."""

import json

from mcp.server import MCPServer
from mcp.server.mcpserver.exceptions import ToolError

# Stand-in for your real ticket store.
TICKETS = {
    "T-1001": {"id": "T-1001", "subject": "PDF export fails for large invoices", "status": "open"},
}

server = MCPServer("casefile")


@server.tool()
def casefile_get_ticket(ticket_id: str) -> str:
    """Get one support ticket by its ID, for example T-1001."""
    ticket = TICKETS.get(ticket_id)
    if ticket is None:
        # ToolError becomes an error result Claude can read and act on,
        # so the message says what to do next.
        raise ToolError(f'Unknown ticket "{ticket_id}". Search for valid IDs first.')
    return json.dumps(ticket)


if __name__ == "__main__":
    # stdio: the Claude app starts this program and talks to it over
    # stdin and stdout. Nothing listens on the network.
    server.run(transport="stdio")
