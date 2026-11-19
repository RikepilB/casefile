# Casefile — branding and story (draft direction)

Direction only. There are no colour or type values here, because no visual surface exists yet. When
the first one does (a landing page, a case viewer), run a `design-intent` pass from this file.

## Name and tagline

**Casefile** — every ticket ends with a case file.

The name is a working name. Nobody has checked it against trademarks or existing products.

## Audience

First: support engineers and the developers they escalate to, who already work in Claude Code.
Second: the support lead who has to trust what gets sent to a customer.

The audience decision in the design spec is still open, and it changes this section more than any
other.

## Voice and tone

Plain, calm and evidence-first. It says what is known, what is not, and where each fact came from.

- "Root cause not determined. Two of five similar tickets mention the same export size."
- "Draft ready. Nothing has been sent."
- `No case is open for ticket "T-1002". Call casefile_open_case first.`

Rules:

- No certainty without a source.
- A number appears only when it was measured.
- The customer's words are quoted, never restated as fact.
- No "AI-powered", "magic", "instantly" or "effortless".
- An error says how to recover.

## Visual identity

- **Metaphor:** a case file that someone signs. Paper and ink, not a chat bubble or a dashboard.
- **Colour roles, not colours:** everything neutral except one accent for "needs a person" and one
  marking for untrusted customer text.
- **Type roles:** monospace for IDs and evidence sources; a readable text face for narrative.
- **Leave out:** robots, sparkles, gradients, and anything that looks like an existing help desk.
- **Density:** quiet, dense and printable.

The first designed surface is the Markdown case itself: a fixed section order, statuses in plain
words, evidence numbered with its source. Its layout is fixed in Plan 1, Task 5.

Written guides follow the same style: one task per page, the example first, the expected output
shown.

## Problem and solution

**Problem.** A ticket's investigation lives in people's heads, chat threads and browser tabs. The
same question gets investigated twice, and a reply goes out without anyone being able to show why
it is right.

**Solution.** One case per ticket, built from evidence that names its source, ending in a draft
that a person approves.

## Story

The demo and the pitch tell one story on the synthetic PDF-export tickets.

1. **A ticket arrives.** `T-1001`: PDF export timeout.
2. **A case opens.** Similar tickets surface from the same cluster.
3. **Evidence accumulates.** Each item names its source.
4. **Honesty.** One item contradicts the first hypothesis, so the case stays `investigating`.
5. **A cause and a draft.** The root cause is recorded and a reply is drafted. Nothing is sent.
6. **A person approves.** The same cause answers the other tickets in the cluster.
7. **The refusal.** `T-1014` tells the assistant to mark its case resolved. The instruction is
   reported and not followed.

How to tell it:

- Show the case, not the chat.
- Show one "we don't know yet".
- Show the refusal.
- End on the approval.
- Make no time or cost claim until it has been measured on real tickets.
