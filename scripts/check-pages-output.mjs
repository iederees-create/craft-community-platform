import assert from "node:assert/strict"; import fs from "node:fs";
const html=fs.readFileSync("out/index.html","utf8");assert.match(html,/\/craft-community-platform\/_next\//);assert.ok(fs.existsSync("out/auth/callback/index.html"));assert.ok(fs.existsSync("out/project/index.html"));console.log("GitHub Pages base path and static routes verified.");
