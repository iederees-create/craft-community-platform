import type { ReactNode } from "react";

// Minimal markdown-to-JSX for rendering our own docs/*.md governance files
// (headings, paragraphs, bullet/numbered lists only — no inline emphasis,
// links, or tables). Not a general-purpose renderer; adding a markdown
// library for one static doc page would be more weight than the job needs.
export function renderSimpleMarkdown(markdown: string): ReactNode[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let listKey = 0;
  let blockKey = 0;

  function flushParagraph() {
    if (paragraphLines.length === 0) return;
    blocks.push(
      <p key={`p-${blockKey++}`} className="text-stone-700">
        {paragraphLines.join(" ")}
      </p>
    );
    paragraphLines = [];
  }

  function flushList() {
    if (listItems.length === 0) return;
    blocks.push(
      <ul key={`ul-${listKey++}`} className="list-disc space-y-1 pl-6 text-stone-700">
        {listItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
    listItems = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === "") {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h1 key={`h1-${blockKey++}`} className="text-3xl font-semibold text-stone-900">
          {line.slice(2)}
        </h1>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push(
        <h2 key={`h2-${blockKey++}`} className="mt-6 text-xl font-semibold text-stone-900">
          {line.slice(3)}
        </h2>
      );
      continue;
    }

    const bulletMatch = line.match(/^[-*]\s+(.*)/);
    const orderedMatch = line.match(/^\d+\.\s+(.*)/);

    if (bulletMatch || orderedMatch) {
      flushParagraph();
      listItems.push((bulletMatch ?? orderedMatch)![1]);
      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}
