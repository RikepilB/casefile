"""Print a reply as it is written."""

import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-opus-5-5",
    max_tokens=64000,
    messages=[{"role": "user", "content": "Explain PDF export in two sentences."}],
) as stream:
    # Yields one chunk of text at a time, as it arrives.
    for chunk in stream.text_stream:
        print(chunk, end="", flush=True)

    # The SDK glues the chunks back into one normal Message for you.
    # Why use it? You still need stop_reason and usage at the end.
    message = stream.get_final_message()

print(f"\nstop_reason: {message.stop_reason}")
print(f"output tokens: {message.usage.output_tokens}")
