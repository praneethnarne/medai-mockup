import { DISCLAIMER } from "../data/conditions.js";

export default function Disclaimer({ className = "" }) {
  return (
    <p
      className={`flex gap-2.5 rounded-lg border border-line bg-surface p-4 text-sm leading-relaxed text-muted ${className}`}
    >
      <svg
        className="mt-0.5 size-4 shrink-0 text-muted"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        role="img"
        aria-label="Important"
      >
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 5v3.5M8 11h.01" strokeLinecap="round" />
      </svg>
      <span>{DISCLAIMER}</span>
    </p>
  );
}
