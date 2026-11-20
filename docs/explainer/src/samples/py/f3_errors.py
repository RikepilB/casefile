"""Handle each kind of API failure differently."""

import anthropic

client = anthropic.Anthropic(
    max_retries=2,  # the default: retries 408, 409, 429, 5xx and network errors
    timeout=60.0,  # seconds in Python (the TypeScript SDK uses milliseconds)
)


def safe_ask(question: str) -> str | None:
    """Ask Claude, returning None when it is worth trying again later.

    Args:
        question: What the user asked.

    Returns:
        The reply text, or None after a rate limit or network failure.

    Raises:
        RuntimeError: The key is wrong, or the API rejected the request.
    """
    try:
        response = client.messages.create(
            model="claude-opus-5-5",
            max_tokens=16000,
            messages=[{"role": "user", "content": question}],
        )
    # Most specific first. Each class means a different fix, so one
    # catch-all would hide which problem you actually have.
    except anthropic.AuthenticationError as error:
        raise RuntimeError("The API key is wrong or missing. Retrying will not help.") from error
    except anthropic.RateLimitError:
        return None  # the SDK already retried twice; tell the caller to slow down
    except anthropic.APIStatusError as error:
        raise RuntimeError(f"Claude API error {error.status_code}: {error.message}") from error
    except anthropic.APIConnectionError:
        return None  # network trouble: safe to try again later

    return "".join(block.text for block in response.content if block.type == "text")
