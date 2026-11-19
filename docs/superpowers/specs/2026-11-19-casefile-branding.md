# Casefile — branding and story (draft direction)

Direction only. There are no colour or type values here, because no visual surface exists yet. When
the first one does (a landing page, a case viewer), run a `design-intent` pass from this file.

## Name and tagline

**Casefile** — one case per incident, with the client's context built in.

The name is a working name. Nobody has checked it against trademarks or existing products.

## Audience

First: the whole support team, technical or not: support agents, support engineers and the
developers they escalate to.
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

**Problem.** One problem reaches support as several tickets, the person who picks one up lacks the
client's context, and work is hard to hand over. The same question is investigated more than once,
the answer is generic, and afterwards nobody can show why a reply was right.

**Solution.** A profile per client and one case per incident. The case runs from the first ticket
to the review, is built from evidence that names its source, can be picked up by anyone on the
team, and ends in drafts that a person approves.

## Story

The demo and the pitch tell one story on the synthetic PDF-export tickets. This story predates the
client profile, the hand-over and the close step, which still need adding to it.

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
