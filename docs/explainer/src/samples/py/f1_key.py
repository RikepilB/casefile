"""Ask Claude a question from server-side code."""

import anthropic

# Anthropic() reads ANTHROPIC_API_KEY from the server's environment.
# Why not write the key here? Source code ends up in git history, and
# anyone who can read the repo could then spend your money.
client = anthropic.Anthropic()


def ask_claude(question: str) -> str:
    """Send one question to Claude and return the text of the reply.

    Args:
        question: What the user asked.

    Returns:
        The text Claude wrote, with any non-text blocks left out.
    """
    # Before this line in a real app: check who is calling, with whatever
    # sign-in your app uses. If this sits behind a public web address,
    # anyone who finds it can spend your credit.
    response = client.messages.create(
        model="claude-opus-5-5",
        max_tokens=16000,
        messages=[{"role": "user", "content": question}],
    )
    # The reply is a list of blocks, not one string. Keep the text blocks.
    return "".join(block.text for block in response.content if block.type == "text")
