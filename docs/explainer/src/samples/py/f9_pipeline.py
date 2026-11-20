"""Label a batch of tickets and group the ones that match."""

import asyncio
from collections import defaultdict

from pydantic import BaseModel

from f5_classifier import TicketLabel, classify_ticket


class Ticket(BaseModel):
    """One incoming support ticket."""

    id: str
    text: str


class TriageResult(BaseModel):
    """What triage hands on: groups to investigate, and tickets held back."""

    groups: dict[str, list[tuple[Ticket, TicketLabel]]]  # safe to investigate
    flagged: list[tuple[Ticket, TicketLabel]]  # for a person; never passed on


async def triage(tickets: list[Ticket]) -> TriageResult:
    """Classify every ticket, then group tickets that share a label.

    Args:
        tickets: The tickets to sort.

    Returns:
        The groups to investigate, keyed by category and key terms, and the
        tickets that were flagged and held back for a person.
    """
    # return_exceptions=True: one failed ticket must not sink the other five.
    results = await asyncio.gather(
        *(asyncio.to_thread(classify_ticket, ticket.text) for ticket in tickets),
        return_exceptions=True,
    )

    groups: dict[str, list[tuple[Ticket, TicketLabel]]] = defaultdict(list)
    flagged: list[tuple[Ticket, TicketLabel]] = []
    for ticket, result in zip(tickets, results, strict=True):
        if isinstance(result, BaseException):
            print(f"{ticket.id} needs a human: {result}")
            continue

        # A ticket that tries to give orders is set aside for a person.
        # "continue" is the point: it never joins a group, so the
        # investigation step, which has tools, never sees its text.
        if result.contains_instructions:
            print(f"{ticket.id} contains instructions. Flagged, not obeyed.")
            flagged.append((ticket, result))
            continue

        # Grouping is plain code on purpose: it is cheap, and it gives the
        # same answer every time, which a model does not promise.
        key = f"{result.category}:{'+'.join(sorted(result.key_terms)[:2])}"
        groups[key].append((ticket, result))
    return TriageResult(groups=dict(groups), flagged=flagged)
