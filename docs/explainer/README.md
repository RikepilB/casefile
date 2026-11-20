# Claude API Explorer

An interactive walkthrough of the pieces Casefile is built from: API keys, the Claude API, the
SDK, tools, MCP, agents, billing, scheduled jobs and Bedrock. Each topic is a flow you step
through one message at a time.

## Open it

- **Online:** <https://claude.ai/artifact/F5BfbN3qqbres8zMU1fuGL>. The link only opens for other
  people once its owner has shared it from the page's Share menu.
- **Offline:** download [`claude-api-explorer.html`](claude-api-explorer.html) and open it in a
  browser. It is one self-contained file. It loads its fonts from Google Fonts and falls back to
  system fonts without a connection.

GitHub shows the HTML file as source. Use the **Download raw file** button on the file's page, or
clone the repository.

## Files

| Path | What it is |
|---|---|
| `claude-api-explorer.html` | The built page. Generated; do not edit by hand. |
| `src/page.html` | Layout, styles and the script that draws the flows. |
| `src/flows.js`, `src/flows2.js` | The content: actors, flows, steps, glossary, use cases. |
| `src/quiz.js` | One check-yourself question per flow. |
| `src/guide.js` | The "Try it yourself" checklist, its three paths, the copyable prompts and the troubleshooting table. |
| `src/samples/ts/src`, `src/samples/py` | The code samples shown in the page's code tab, in TypeScript and Python. |
| `src/build.mjs` | Puts the three together into the built page. |

## Rebuild

```bash
cd docs/explainer/src
node build.mjs
```

The build needs Node only, with no packages. To type-check the TypeScript samples, run
`npm install` and `npx tsc --noEmit` in `src/samples/ts`.

## What to know before relying on it

- All ticket IDs, names and token counts are synthetic examples.
- The code samples were type-checked and linted. Samples that call the Claude API were not run,
  because that needs an API key and costs money. The two MCP server samples were run locally.
- Plan prices, billing rules and data-retention wording were read from Anthropic's public pages on
  20 November 2026. They change; check the source pages before budgeting.
- The Claude Code flow's payloads are simplified to show their shape.
- What Claude in Chrome can and cannot do, and where keys and spend limits live in the Console, were
  read from Anthropic's documentation and help pages on 20 November 2026. Nobody ran the
  "Try it yourself" steps or the prompts end to end.
