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
  const stats: { value: string; label: string; numeric: boolean }[] = [
    { value: String(documents), label: documents === 1 ? "Document" : "Documents", numeric: true },
    { value: String(topics), label: topics === 1 ? "Topic area" : "Topic areas", numeric: true },
    { value: "SEBT NEXT + RISE", label: "Batches covered", numeric: false },
  ];

  return (
    <section className="border-t border-fd-border bg-fd-muted/30">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="grid gap-px overflow-hidden rounded-xl border border-fd-border bg-fd-border sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-fd-background px-8 py-10 text-center">
              <p
                className={
                  stat.numeric
                    ? "font-display text-3xl font-semibold text-fd-primary sm:text-4xl"
                    : "font-display text-xl font-semibold tracking-[-0.01em] text-nowrap text-fd-primary sm:text-2xl"
                }
              >
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-fd-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
