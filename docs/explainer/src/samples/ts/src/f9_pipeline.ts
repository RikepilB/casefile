import { classifyTicket, type TicketLabel } from "./f5_classifier.js";

interface Ticket {
  id: string;
  text: string;
}

interface Labelled {
  ticket: Ticket;
  label: TicketLabel;
}

interface TriageResult {
  groups: Map<string, Labelled[]>; // safe to hand to the investigation step
  flagged: Labelled[]; // for a person to read; never passed on automatically
}

export async function triage(tickets: Ticket[]): Promise<TriageResult> {
  // allSettled, not all: one failed ticket must not sink the other five.
  const results = await Promise.allSettled(
    tickets.map(async (ticket) => ({ ticket, label: await classifyTicket(ticket.text) })),
  );

  const groups = new Map<string, Labelled[]>();
  const flagged: Labelled[] = [];
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Needs a human:", result.reason);
      continue;
    }
    const { ticket, label } = result.value;

    // A ticket that tries to give orders is set aside for a person.
    // "continue" is the point: it never joins a group, so the
    // investigation step, which has tools, never sees its text.
    if (label.contains_instructions) {
      console.warn(`${ticket.id} contains instructions. Flagged, not obeyed.`);
      flagged.push({ ticket, label });
      continue;
    }

    // Grouping is plain code on purpose: it is cheap, and it gives the
    // same answer every time, which a model does not promise.
    const key = `${label.category}:${[...label.key_terms].sort().slice(0, 2).join("+")}`;
    groups.set(key, [...(groups.get(key) ?? []), { ticket, label }]);
  }
  return { groups, flagged };
}
