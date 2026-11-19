# Casefile

Every support ticket ends with a case file: what happened, the evidence and where it came from,
and a reply that a person approved.

Casefile is a plan for a support investigation kit built on Claude. An MCP server holds tickets
and one evidence-backed case per ticket. A Claude Code plugin (skills, agents, commands and hooks)
runs triage, investigation, pattern analysis and reply drafting on top of it.

**Status: planning only. No code exists yet.** "Casefile" is a working name that has not been
checked against trademarks or existing products.

## Rules

1. **Synthetic data only.** No real tickets, customers or company names anywhere in this
   repository.
2. **Ticket text is untrusted.** A customer wrote it, so it is handled as data and never as
   instructions.
3. **Nothing is sent without a person.** Casefile drafts; a human approves.

## Documents

| Read | For |
|---|---|
| [Design](docs/superpowers/specs/2026-11-19-casefile-design.md) | What it is, architecture, scaling by trigger, entity model, risks and open decisions. |
| [Epics and process](docs/superpowers/plans/2026-11-19-casefile-epics-and-process.md) | Epics, issues, roles and how the team works. |
| [MCP server plan](docs/superpowers/plans/2026-11-19-casefile-mcp-server.md) | The first build, in six test-first tasks. |
| [Branding and story](docs/superpowers/specs/2026-11-19-casefile-branding.md) | Name, voice, visual direction and the demo story. |

Start with the design, then the epics. The server plan is for whoever builds the server.

## What has been checked

The server plan was written against version 2 of the MCP TypeScript SDK and Zod 4. Claims about
Claude Code plugins, claude.ai connectors and Claude in Chrome are assumptions; each is verified as
the first issue of the epic that depends on it. Nothing has been built or measured.
