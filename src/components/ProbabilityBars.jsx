import { CONDITIONS } from "../data/conditions.js";

export default function ProbabilityBars({ probabilities, predicted }) {
  const rows = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);

  return (
    <ul className="flex flex-col gap-2.5">
      {rows.map(([code, value]) => {
        const isTop = code === predicted;
        return (
          <li key={code} className="flex items-center gap-3">
            <span
              className={`w-14 shrink-0 font-mono text-xs ${
                isTop ? "font-medium text-ink" : "text-muted"
              }`}
            >
              {code}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block h-2 overflow-hidden rounded-full bg-routine-wash">
                <span
                  className={`block h-full rounded-full ${
                    isTop ? "bg-accent" : "bg-line"
                  }`}
                  style={{ width: `${Math.max(value * 100, 1.5)}%` }}
                />
              </span>
            </span>
            <span
              className={`w-12 shrink-0 text-end font-mono text-xs ${
                isTop ? "font-medium text-ink" : "text-muted"
              }`}
            >
              {(value * 100).toFixed(1)}
            </span>
            <span className="hidden w-44 shrink-0 truncate text-xs text-muted sm:block">
              {CONDITIONS[code]?.name}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
