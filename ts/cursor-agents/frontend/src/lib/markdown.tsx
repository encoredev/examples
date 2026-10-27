import { Fragment, type ReactNode } from "react";

// Just enough Markdown for agent replies: paragraphs, bullet and numbered
// lists, **bold** and `code`. Anything else renders as plain text.

const inline = (text: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    return <Fragment key={i}>{part}</Fragment>;
  });

export function Markdown({ text, caret }: { text: string; caret?: boolean }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <div className="prose">
      {blocks.map((block, i) => {
        const last = i === blocks.length - 1;
        const lines = block.split("\n");
        const bullet = lines.every((l) => /^\s*[-*•]\s+/.test(l));
        const numbered = lines.every((l) => /^\s*\d+[.)]\s+/.test(l));
        if (bullet || numbered) {
          const items = lines.map((l) => l.replace(/^\s*([-*•]|\d+[.)])\s+/, ""));
          const List = numbered ? "ol" : "ul";
          return (
            <List key={i}>
              {items.map((it, j) => (
                <li key={j}>
                  {inline(it)}
                  {caret && last && j === items.length - 1 && <span className="caret" />}
                </li>
              ))}
            </List>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l)}
              </Fragment>
            ))}
            {caret && last && <span className="caret" />}
          </p>
        );
      })}
    </div>
  );
}
