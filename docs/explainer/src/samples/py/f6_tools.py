"""Let Claude ask your code to look something up."""

import json

import anthropic
from anthropic import beta_tool

client = anthropic.Anthropic()

# Stand-in for your real database.
TICKETS = [
    {"id": "T-1001", "subject": "PDF export fails for large invoices"},
    {"id": "T-1002", "subject": "Export to PDF spins forever"},
]


# The docstring is what Claude reads to decide when to use the tool.
# A vague docstring is the most common reason a tool never gets called.
@beta_tool
def search_tickets(query: str) -> str:
    """Search support tickets by words in the subject. Returns id and subject.

    Args:
        query: Words to look for.
    """
    # This function runs on YOUR machine. Claude only sees what it returns.
    matches = [t for t in TICKETS if query.lower() in t["subject"].lower()]
    return json.dumps(matches)


# The tool runner repeats "ask Claude, run the tool, send the result back"
# until Claude answers without asking for another tool.
runner = client.beta.messages.tool_runner(
    model="claude-opus-5-5",
    max_tokens=16000,
    tools=[search_tickets],
    messages=[{"role": "user", "content": "Are other tickets like T-1001 about PDF export?"}],
)

final_message = runner.until_done()
for block in final_message.content:
    if block.type == "text":
        print(block.text)
