"""Count tokens, cache the repeated part, and read the receipt."""

import anthropic
from anthropic.types import MessageParam

client = anthropic.Anthropic()
MODEL = "claude-opus-5-5"

# Imagine this is a long labelling guide: thousands of tokens that are
# identical on every request. That sameness is what makes caching pay.
GUIDE = "You label support tickets for Acme Invoices. (…long guide…)"
messages: list[MessageParam] = [
    {"role": "user", "content": "<ticket>\nPDF export hangs at 90%.\n</ticket>"},
]

# 1. Ask how big the request is before you send it.
count = client.messages.count_tokens(model=MODEL, system=GUIDE, messages=messages)
print(f"This request is {count.input_tokens} input tokens.")

# 2. Send it, marking the guide as cacheable. Why mark only the guide?
# Caching matches from the start of the request, so the part that
# never changes goes first and the part that changes goes after.
response = client.messages.create(
    model=MODEL,
    max_tokens=2048,
    system=[{"type": "text", "text": GUIDE, "cache_control": {"type": "ephemeral"}}],
    messages=messages,
)

# 3. Read the receipt. Dollars per million tokens for this model:
# input 4, cache write 5 (1.25x input), cache read 0.20 (0.05x input), output 20.
usage = response.usage
dollars = (
    usage.input_tokens * 4
    + (usage.cache_creation_input_tokens or 0) * 5
    + (usage.cache_read_input_tokens or 0) * 0.2
    + usage.output_tokens * 20
) / 1_000_000
print(f"Cache read: {usage.cache_read_input_tokens or 0} tokens. Cost: ${dollars:.4f}")
