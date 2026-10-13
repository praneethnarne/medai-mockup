import { PIPELINE_STAGES } from "../lib/mockPredict.js";

export default function AnalysingState({ stageIndex, imageUrl }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-start gap-6">
        <div className="size-28 shrink-0 overflow-hidden rounded-lg border border-line bg-ground">
          <img src={imageUrl} alt="" className="size-full object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="mb-1 text-lg font-semibold">Analysing image</h1>
          <p className="mb-5 text-sm text-muted">
            Simulated for this demo — the real pipeline runs these same four stages.
          </p>

          <ol className="flex flex-col gap-3">
            {PIPELINE_STAGES.map((stage, i) => {
              const done = i < stageIndex;
              const active = i === stageIndex;
              return (
                <li key={stage.key} className="flex items-center gap-3 text-sm">
                  <span
                    aria-hidden="true"
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                      done
                        ? "border-accent bg-accent text-white"
                        : active
                          ? "border-accent text-accent"
                          : "border-line text-line"
                    }`}
                  >
                    {done ? (
                      <svg
                        viewBox="0 0 16 16"
                        className="size-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span
                        className={`size-1.5 rounded-full ${
                          active ? "animate-pulse bg-accent" : "bg-line"
                        }`}
                      />
                    )}
                  </span>
                  <span className={done || active ? "text-ink" : "text-muted"}>
                    {stage.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
