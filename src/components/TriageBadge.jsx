import { TRIAGE } from "../data/conditions.js";

const styles = {
  urgent: "border-urgent/30 bg-urgent-wash text-urgent",
  prompt: "border-prompt/30 bg-prompt-wash text-prompt",
  routine: "border-line bg-routine-wash text-routine",
};

// Shape differs alongside colour so the tiers aren't distinguished by hue alone.
const marks = {
  urgent: (
    <path d="M8 4.5v4.5M8 11.5h.01" strokeLinecap="round" strokeWidth="2" />
  ),
  prompt: <path d="M8 4.5v3.5l2.5 2" strokeLinecap="round" strokeWidth="1.8" />,
  routine: <path d="M4.5 8h7" strokeLinecap="round" strokeWidth="1.8" />,
};

export default function TriageBadge({ triage, size = "md" }) {
  const tier = TRIAGE[triage] ?? TRIAGE.routine;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 font-medium ${
        styles[triage] ?? styles.routine
      } ${size === "sm" ? "min-h-7 text-xs" : "min-h-9 text-sm"}`}
    >
      <svg
        viewBox="0 0 16 16"
        className="size-4 shrink-0"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="6.5" strokeWidth="1.4" />
        {marks[triage] ?? marks.routine}
      </svg>
      {tier.label}
    </span>
  );
}
