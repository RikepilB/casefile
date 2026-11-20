"""The same request, sent through Amazon Bedrock."""

from anthropic import AnthropicBedrockMantle

# No Anthropic API key anywhere. The client signs each request with the
# AWS credentials already on this machine (a role, SSO, or ~/.aws/credentials).
client = AnthropicBedrockMantle(aws_region="us-east-1")

response = client.messages.create(
    # Bedrock model IDs carry an "anthropic." prefix.
    model="anthropic.claude-opus-5-5",
    max_tokens=16000,
    messages=[{"role": "user", "content": "What does a 'pending' ticket mean?"}],
)

# From here on, the code is identical to calling Anthropic directly.
print("".join(block.text for block in response.content if block.type == "text"))
