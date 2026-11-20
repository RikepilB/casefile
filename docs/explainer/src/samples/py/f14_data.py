"""Keep the conversation yourself, because Claude does not."""

import anthropic
from anthropic.types import MessageParam

client = anthropic.Anthropic()

# Claude keeps nothing between calls, so the conversation lives here.
# In a real app this dict is a database table keyed by conversation ID.
conversations: dict[str, list[MessageParam]] = {}


def reply(conversation_id: str, user_text: str) -> str:
    """Add a user message, ask Claude, and remember both sides.

    Args:
        conversation_id: Which conversation this message belongs to.
        user_text: What the user just said.

    Returns:
        The text of Claude's reply.
    """
    history = conversations.setdefault(conversation_id, [])
    history.append({"role": "user", "content": user_text})

    response = client.messages.create(
        model="claude-opus-5-5",
        max_tokens=16000,
        messages=history,  # the whole conversation, every time
    )

    # Store the full content, not only the text. Later turns need the
    # exact blocks Claude produced, or the history no longer matches.
    history.append({"role": "assistant", "content": response.content})

    return "".join(block.text for block in response.content if block.type == "text")


def forget(conversation_id: str) -> None:
    """Delete a conversation. Nothing else holds a copy for you.

    Args:
        conversation_id: The conversation to remove.
    """
    conversations.pop(conversation_id, None)
