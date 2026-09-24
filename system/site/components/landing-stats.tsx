import type { ReactElement } from "react";

/**
 * The landing page's stat row.
 *
 * Every number here is read from the record itself (page counts, folder
 * counts) or is instance.md's own declared scope — never invented traffic or
 * user figures a fresh record has no way to have earned yet.
 */
export function LandingStats({
  documents,
  topics,
}: {
  documents: number;
  topics: number;
}): ReactElement {
  const stats: { value: string; label: string }[] = [
    { value: String(documents), label: documents === 1 ? "Document" : "Documents" },
    { value: String(topics), label: topics === 1 ? "Topic area" : "Topic areas" },
  ];

  return (
    <section className="border-t border-fd-border bg-fd-muted/30">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-16">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-fd-border bg-fd-border grid-cols-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-fd-background px-4 py-7 text-center transition-colors sm:px-8 sm:py-12"
            >
              <p className="font-display text-4xl font-semibold tracking-[-0.02em] text-fd-primary sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-3 font-mono text-xs tracking-[0.14em] text-fd-muted-foreground uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
