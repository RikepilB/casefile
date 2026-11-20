// Builds ../claude-api-explorer.html from page.html, the flow data and the code samples.
// Run from this folder: node build.mjs
import { readFileSync, writeFileSync } from "node:fs";

const names = ["f1_key", "f2_message", "f3_errors", "f4_stream", "f5_classifier", "f6_tools", "f7_mcp",
  "f8_agent", "f9_pipeline", "f10_tokens", "f11_cron", "f12_bedrock", "f14_data"];
const code = {};
for (const n of names) {
  code[n] = {
    ts: readFileSync(`samples/ts/src/${n}.ts`, "utf8").trimEnd(),
    py: readFileSync(`samples/py/${n}.py`, "utf8").trimEnd(),
  };
}
// "</" inside an inline <script> would end the script early, so escape it.
const safe = (s) => s.replace(/<\//g, "<\\/");
const body = readFileSync("page.html", "utf8")
  .replace("/*__DATA__*/", () => safe(readFileSync("flows.js", "utf8") + "\n" + readFileSync("flows2.js", "utf8") + "\n" + readFileSync("quiz.js", "utf8") + "\n" + readFileSync("guide.js", "utf8")))
  .replace("/*__CODE__*/", () => "const CODE = " + safe(JSON.stringify(code)) + ";");

// page.html is only the page content (the hosted version gets its shell added when published).
// A downloaded file needs its own shell to open correctly in a browser.
const shell = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n' +
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' +
  "<style>body{margin:0}[hidden]{display:none!important}</style>\n</head>\n<body>\n";
writeFileSync("../claude-api-explorer.html", shell + body + "\n</body>\n</html>\n");
// The hosted version is published without the shell; set ARTIFACT_OUT to also write that form.
if (process.env.ARTIFACT_OUT) writeFileSync(process.env.ARTIFACT_OUT, body);
console.log("wrote ../claude-api-explorer.html", shell.length + body.length, "bytes");
