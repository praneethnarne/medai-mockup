export default function DemoBadge({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-prompt/30 bg-prompt-wash px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide text-prompt ${className}`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-prompt" />
      DEMO DATA
    </span>
  );
}
