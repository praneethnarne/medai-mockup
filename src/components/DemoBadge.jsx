import useServerUrl from "../lib/useLive.js";

// Says plainly whether results come from the trained model or the simulation.
export default function DemoBadge({ className = "", live: forced, compact = false }) {
  const url = useServerUrl();
  const live = forced ?? Boolean(url);
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs text-muted ${className}`} title={live ? "Connected to the trained model" : "Simulated results"}>
        <span aria-hidden="true" className={`size-2 rounded-full ${live ? "bg-accent shadow-[0_0_0_3px_rgb(15_118_110/0.15)]" : "bg-prompt"}`} />
        <span className="hidden sm:inline">{live ? "Model live" : "Simulation"}</span>
      </span>
    );
  }
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
