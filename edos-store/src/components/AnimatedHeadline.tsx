/**
 * Big headline whose letters rise into place one by one.
 * - `lines`: each line is an array of words, e.g. [["Wear", "your"], ["heritage."]]
 * - a line with `gold: true` is drawn in gold with a light wave running across it
 * Speed: change DELAY_STEP (ms between letters) or the start delays in index.css (.hero-letter).
 */
export interface HeadlineLine { words: string[]; gold?: boolean }

const DELAY_STEP = 55;

export function AnimatedHeadline({ lines, className = "" }: { lines: HeadlineLine[]; className?: string }) {
  let n = 0; // running letter number, so the animation flows from the first letter to the last
  return (
    <h1 className={className} aria-label={lines.map((l) => l.words.join(" ")).join(" ")}>
      {lines.map((line, li) => (
        <span key={li} className="hero-line" aria-hidden="true">
          {line.words.map((word, wi) => (
            <span key={wi} className="inline-block whitespace-nowrap">
              {[...word].map((ch, ci) => {
                const i = n++;
                return (
                  <span key={ci} className={`hero-letter ${line.gold ? "hero-gold" : ""}`} style={{ ["--i" as string]: i, ["--step" as string]: `${DELAY_STEP}ms` }}>{ch}</span>
                );
              })}
              {wi < line.words.length - 1 && <span className="hero-letter">&nbsp;</span>}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
