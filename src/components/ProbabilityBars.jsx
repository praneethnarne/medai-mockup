import { CONDITIONS } from "../data/conditions.js";

// Ranked scores. `limit` keeps the visible list short; the rest go behind a toggle.
export default function ProbabilityBars({ probabilities, predicted, names, limit }) {
  const all = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);
  const rows = limit ? all.slice(0, limit) : all;

  return (
    <ul className="flex flex-col gap-3">
      {rows.map(([code, value]) => {
        const isTop = code === predicted;
        return (
          <li key={code}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
              <span className={isTop ? "font-medium text-ink" : "text-muted"}>
                {names?.[code] ?? CONDITIONS[code]?.name ?? code}
              </span>
              <span className={`font-mono text-xs ${isTop ? "text-ink" : "text-muted"}`}>
                {(value * 100).toFixed(1)}%
              </span>
            </div>
            <span className="block h-2 overflow-hidden rounded-full bg-routine-wash">
              <span
                className={`block h-full rounded-full ${isTop ? "bg-accent" : "bg-muted/40"}`}
                style={{ width: `${Math.max(value * 100, 1)}%` }}
              />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
