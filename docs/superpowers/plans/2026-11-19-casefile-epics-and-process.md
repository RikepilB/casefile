# Casefile — epics, issues and team process (draft for review)

For a team of three engineers and one product owner. It follows
`docs/superpowers/specs/2026-11-19-casefile-design.md`. Nothing here is in a tracker yet, and there
are no dates or hour estimates: nothing has been measured.

## Epics

| # | Epic | Done when | Needs |
|---|---|---|---|
| E1 | MCP server | `npm run check` passes and the hand check in Claude Code is recorded. | — |
| E2 | Investigation harness (plugin) | One command takes a synthetic ticket to a case with evidence and a draft reply; a test shows the approval hook blocking an outward call. | E1 |
| E3 | Evals | A labelled synthetic set and a scorer run in CI; a skill change shows its score before and after. | E1, E2 |
| E4 | Real ticket source | One adapter passes the same source tests as the fixtures. | E1, data sign-off |
| E5 | Team serving | Two people see the same case over HTTP with auth; each evidence item has an author. | E1 |
| E6 | Browser reproduction | A skill reproduces a scripted issue in a demo app and attaches `repro` evidence. | E2 |
| E7 | Patterns and incidents | Cases with one root cause are grouped, with one drafted update per affected ticket. | E2, E3 |
| E8 | Guides | A new person gets from clone to a first case using only the guide. | E2 |
| E9 | Name, brand and demo | The name is checked, and the demo story runs end to end on synthetic tickets. | E2 |

Milestones are outcomes, in this order: **M1** walking skeleton (E1 plus the `investigate` skill);
**M2** the whole flow on synthetic data with evals (E2, E3); **M3** a real source and team serving
(E4, E5; blocked on data sign-off); **M4** a pilot with real users.

## Issues

**E1** has six issues: the six tasks of `2026-11-19-casefile-mcp-server.md`, which are not repeated
here. The plan's running test counts assume the tasks land in order; if Tasks 2 and 3 run in parallel,
compare results per test file.

**E2 — investigation harness**

1. Verify the current plugin, skill, agent, hook and command formats in the Claude Code docs, and
   whether one plugin runs unchanged in the terminal, desktop and web. Blocks the rest.
2. Write the plugin spec section and its plan.
3. `investigate` skill: open the case, read the ticket, find similar tickets, gather evidence from
   whatever servers are available, record a hypothesis, update the case.
4. `triage` skill: category, severity and duplicate check.
5. Capability map: one config file that tells skills which MCP tools supply logs, code and account
   data, so the harness works with the business's own servers or without them.
6. Reviewer agent: rejects a root cause that has no supporting evidence.
7. Approval hook: blocks a deny-list of outward tools unless a person approved; tested with a fake
   `send` tool.
8. `draft-reply` skill: writes `draft_reply` from the case alone.

**E3 — evals**

1. Label the 24 tickets: expected category, severity, cluster and a one-sentence root cause.
2. Verify the headless entry point for running a skill without a person, then build the runner.
3. Scorer, report and CI job.
4. Injection eval: reading `T-1014` must never produce a case update.

**E4–E9** get their issues when they start. The first issue of each is a verification:

- E4: the help desk's API, and whether an official MCP server for it already exists. If it does,
  scan it and wrap it; don't rebuild it.
- E5: what Claude Desktop and claude.ai require of a remote server (transport, auth).
- E6: what Claude in Chrome can do and how a skill hands work to it.
- E9: whether the name is free to use.

## Who does what

| Role | Owns |
|---|---|
| Product owner | The problem statement; the synthetic ticket set (Plan 1, Task 1, Step 6 is JSON checked by a test); eval labels; accepting each flow by running it in Claude; the story and demo. |
| Engineer A — server and data | Plan 1 Tasks 1, 2 and 4; later E4 and E5. |
| Engineer B — store and harness | Plan 1 Tasks 3 and 5; then E2. |
| Engineer C — quality | The verification issues; E3; CI; security review; Plan 1 Task 6. Reviews every change to a tool contract. |

Starting in parallel: Task 1 lands first (Engineer A with the product owner's tickets). Tasks 2 and
3 share nothing except Task 1, so A and B take one each while C does E2 issue 1 and the eval
runner. Task 4 needs 2 and 3; Task 5 needs 4; Task 6 needs 5.

## How the team works

- **One chain of truth:** spec → plan → issue → pull request. A tool contract change starts as a
  spec edit that all three engineers review.
- **Branches and review:** one branch and one pull request per issue; one human review, never the
  author's own; `npm run check` green; no direct commits to `main`.
- **Done means:** tests written first and passing; eval score not lower, once E3 exists; the
  README or a guide updated; any decision added to `docs/decisions.md`.
- **Vertical slices:** every issue ends in something a person can run.
- **Agents are teammates' tools:** whoever runs an agent on a plan task owns its pull request, and
  it gets the same review. Skills and prompts are code: they change by pull request with the eval
  result attached.
- **Product owner loop:** a demo on synthetic tickets at the end of each epic. Acceptance is the
  product owner running the flow, not reading code. A behaviour they want is written as a new
  synthetic ticket with its expected outcome.
- **Sizing:** small, medium or large; split anything large. No hour estimates.
- **Rhythm:** plan once per epic, a short written note per working day, a demo per epic.

## Not decided

The issue tracker (GitHub Issues on this repository is the default) and who gets write access.
