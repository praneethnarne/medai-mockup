// One result section: a numbered title, then one short line saying why it is shown.
export default function Section({ step, title, why, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgb(20_24_31/0.04)] sm:p-6 ${className}`}>
      <header className="mb-4 flex items-start gap-3">
        {step && (
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-wash font-mono text-xs font-medium text-accent-dark"
          >
            {step}
          </span>
        )}
        <div>
          <h2 className="text-lg font-semibold leading-7">{title}</h2>
          {why && <p className="text-sm text-muted">{why}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

// A closed-by-default disclosure, so detail is one click away instead of on screen.
export function More({ label, children, className = "" }) {
  return (
    <details className={`group rounded-lg border border-line ${className}`}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
        {label}
        <svg
          viewBox="0 0 16 16"
          className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="border-t border-line px-4 py-3">{children}</div>
    </details>
  );
}
