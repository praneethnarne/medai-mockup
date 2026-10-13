import { CONDITIONS, DISCLAIMER, TRIAGE } from "../data/conditions.js";
import TriageBadge from "./TriageBadge.jsx";

const accent = {
  urgent: "border-s-urgent",
  prompt: "border-s-prompt",
  routine: "border-s-routine",
};

function Bullets({ title, items, icon }) {
  return (
    <div>
      <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-line" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CareGuidance({ code }) {
  const condition = CONDITIONS[code];
  if (!condition) return null;

  const tier = TRIAGE[condition.triage];
  const isSerious = condition.triage !== "routine";

  return (
    <section
      className={`rounded-xl border border-line border-s-4 bg-surface p-5 sm:p-6 ${
        accent[condition.triage]
      }`}
    >
      <header className="mb-4">
        <h2 className="mb-3 text-base font-semibold">What to do next</h2>
        <TriageBadge triage={condition.triage} />
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">{tier.note}</p>
      </header>

      <div className="mb-6 rounded-lg bg-ground p-4">
        <h3 className="mb-1.5 text-sm font-semibold">Seeking care</h3>
        <p className="max-w-prose text-sm leading-relaxed text-muted">
          {condition.seekCare}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Bullets
          title={isSerious ? "While you wait for your appointment" : "Looking after it"}
          items={condition.selfCare}
          icon={
            <svg
              viewBox="0 0 16 16"
              className="size-4 text-accent"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <Bullets
          title="Get seen sooner if"
          items={condition.redFlags}
          icon={
            <svg
              viewBox="0 0 16 16"
              className="size-4 text-urgent"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M8 2.5l5.5 10h-11L8 2.5z" strokeLinejoin="round" />
              <path d="M8 6.5v3M8 11.5h.01" strokeLinecap="round" />
            </svg>
          }
        />
      </div>

      <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-muted">
        This guidance follows the predicted category above, which may be wrong. It is
        general information, not a treatment plan. {DISCLAIMER}
      </p>
    </section>
  );
}
