import fs from "node:fs";
import path from "node:path";
import { renderSimpleMarkdown } from "@/lib/markdown/simple-render";

export const metadata = {
  title: "Community Charter — Tuftlings",
};

// Renders docs/COMMUNITY_CHARTER.md (Codex-owned governance content) as-is
// at build time. This page must never fork or restate the charter — it
// reads the authored file directly so the two can never drift apart.
export default function GuidelinesPage() {
  const charterPath = path.join(process.cwd(), "docs", "COMMUNITY_CHARTER.md");
  const charterMarkdown = fs.readFileSync(charterPath, "utf-8");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-8 pb-20">
      {renderSimpleMarkdown(charterMarkdown)}
    </div>
  );
}
