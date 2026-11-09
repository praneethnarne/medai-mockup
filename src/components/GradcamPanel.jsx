import { useId, useState } from "react";
import Section from "./Section.jsx";

// Without a live server the overlay is an ILLUSTRATIVE radial gradient at the
// simulated focus point, and the caption says so. Live results carry the real
// Grad-CAM layer and the exact square the model saw.
function heatmapGradient({ x, y, spread }) {
  return [
    `radial-gradient(circle at ${x}% ${y}%,`,
    `rgba(220,38,38,0.85) 0%,`,
    `rgba(249,115,22,0.70) ${spread * 0.45}%,`,
    `rgba(250,204,21,0.50) ${spread * 0.8}%,`,
    `rgba(34,197,94,0.28) ${spread * 1.2}%,`,
    `rgba(30,64,175,0.18) ${spread * 1.7}%,`,
    `rgba(30,64,175,0) ${spread * 2.2}%)`,
  ].join(" ");
}

export default function GradcamPanel({ imageUrl, focus, cropUrl, heatUrl, step }) {
  const real = Boolean(heatUrl);
  const base = real ? cropUrl : imageUrl;
  const [opacity, setOpacity] = useState(0.65);
  const sliderId = useId();

  return (
    <Section
      step={step}
      title="Why it gave this answer"
      why="Red shows what the model looked at. Red on the spot means it looked at the right thing."
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <figure className="m-0">
          <div className="aspect-square overflow-hidden rounded-xl bg-ground">
            <img src={base} alt="The photo the model analysed" className="size-full object-cover" />
          </div>
          <figcaption className="mt-2 text-xs text-muted">Your photo</figcaption>
        </figure>
        <figure className="m-0">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-ground">
            <img src={base} alt="The same photo with the attention heatmap" className="size-full object-cover" />
            {real ? (
              <img
                src={heatUrl}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 size-full object-cover"
                style={{ opacity }}
              />
            ) : (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: heatmapGradient(focus), opacity }}
              />
            )}
          </div>
          <figcaption className="mt-2 text-xs text-muted">
            {real ? "Where it looked (Grad-CAM)" : "Illustration only — not a real heatmap"}
          </figcaption>
        </figure>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <label htmlFor={sliderId} className="shrink-0 text-xs text-muted">
          Heatmap
        </label>
        <input
          id={sliderId}
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="h-11 min-w-0 flex-1 accent-[#0e7c7b]"
        />
      </div>
    </Section>
  );
}
