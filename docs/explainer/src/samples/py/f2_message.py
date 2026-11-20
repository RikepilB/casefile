"""One request, one reply, and what it cost."""

import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-5-5",
    # A ceiling, not a target: you pay for tokens produced, not for the limit.
    max_tokens=16000,
    system="You are a support assistant for Acme Invoices. Be brief.",
    messages=[{"role": "user", "content": "What does a 'pending' ticket mean?"}],
)

# Always look at why Claude stopped before trusting the answer.
# "max_tokens" means it was cut off; "refusal" means it declined.
if response.stop_reason != "end_turn":
    raise RuntimeError(f"Unexpected stop: {response.stop_reason}")

for block in response.content:
    if block.type == "text":
        print(block.text)

# Prices are per million tokens: $4 in, $20 out for this model.
usage = response.usage
dollars = (usage.input_tokens * 4 + usage.output_tokens * 20) / 1_000_000
print(f"This call cost about ${dollars:.4f}")
