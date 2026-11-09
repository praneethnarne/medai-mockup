import useServerUrl from "../lib/useLive.js";

// Says plainly whether results come from the trained model or the simulation.
export default function DemoBadge({ className = "", live: forced }) {
  const url = useServerUrl();
  const live = forced ?? Boolean(url);
  return live ? (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-wash px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide text-accent-dark ${className}`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
      LIVE MODEL
    </span>
  ) : (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-prompt/30 bg-prompt-wash px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide text-prompt ${className}`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-prompt" />
      DEMO DATA
    </span>
  );
}
