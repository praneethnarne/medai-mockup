import { CONDITIONS, TRIAGE } from "../data/conditions.js";
import Section, { More } from "./Section.jsx";

const tone = {
  urgent: "border-urgent/30 bg-urgent-wash text-urgent",
  prompt: "border-prompt/30 bg-prompt-wash text-prompt",
  routine: "border-line bg-routine-wash text-routine",
};

function List({ items }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-muted/50" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function CareGuidance({ code, step }) {
  const condition = CONDITIONS[code];
  if (!condition) return null;
  const tier = TRIAGE[condition.triage];
  const serious = condition.triage !== "routine";

  return (
    <Section step={step} title="What to do next" why="One clear action, based on the likely type.">
      <div className={`rounded-xl border p-4 ${tone[condition.triage]}`}>
        <p className="text-base font-semibold">{tier.label}</p>
        <p className="mt-1 text-sm text-ink">{tier.note}</p>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <More label={serious ? "While you wait" : "Looking after it"}>
          <List items={condition.selfCare} />
        </More>
        <More label="Get seen sooner if">
          <List items={condition.redFlags} />
        </More>
      </div>
    </Section>
  );
}
