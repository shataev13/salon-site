import Link from "next/link";

type Block = { t: string; text: string };

/* Универсальная страница юридического документа (политика, оферта,
   правила, согласие). Контент приходит из content/legal/*.json. */
export default function LegalDocument({
  title,
  updated,
  blocks,
}: {
  title: string;
  updated?: string | null;
  blocks: Block[];
}) {
  return (
    <main className="bg-background">
      <article className="mx-auto max-w-[820px] px-6 py-16 sm:py-24">
        <span
          aria-hidden="true"
          className="mb-6 block h-0.5 w-10 rounded-full bg-accent"
        />
        <h1 className="font-display text-4xl font-medium leading-tight text-ink-deep sm:text-5xl">
          {title}
        </h1>
        {updated && (
          <p className="mt-4 text-sm uppercase tracking-[0.16em] text-accent">
            {updated}
          </p>
        )}

        <div className="mt-10">
          {blocks.map((b, i) => {
            if (b.t === "h2") {
              return (
                <h2
                  key={i}
                  className="mt-10 font-display text-2xl font-medium text-ink-deep first:mt-0 sm:text-3xl"
                >
                  {b.text}
                </h2>
              );
            }
            if (b.t === "li") {
              return (
                <p
                  key={i}
                  className="mt-3 flex gap-3 leading-relaxed text-ink-deep/75"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
                  />
                  <span>{b.text}</span>
                </p>
              );
            }
            return (
              <p key={i} className="mt-4 leading-relaxed text-ink-deep/75">
                {b.text}
              </p>
            );
          })}
        </div>

        <div className="mt-14 border-t border-ink-deep/10 pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-display text-lg text-accent transition-colors hover:text-accent-hover"
          >
            ← На главную
          </Link>
        </div>
      </article>
    </main>
  );
}
