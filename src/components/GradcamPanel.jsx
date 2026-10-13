import { useId, useState } from "react";

// The overlay here is an ILLUSTRATIVE stand-in: a radial gradient placed at the
// focus point from the simulated result. The real Grad-CAM heatmap comes from
// the model's last convolutional layer activations and class gradients, which
// needs the trained model and the backend.
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

export default function GradcamPanel({ imageUrl, focus }) {
  const [opacity, setOpacity] = useState(0.65);
  const sliderId = useId();

  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <header className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
        <h2 className="text-base font-semibold">Where the system was looking</h2>
        <span className="font-mono text-xs text-muted">Grad-CAM</span>
      </header>
      <p className="mb-5 max-w-prose text-sm leading-relaxed text-muted">
        The coloured patch marks the part of the photo the system based its answer
        on. Red is where it paid most attention. If the red sits on the spot, it
        looked at the right thing — if it sits on plain skin or on a hair, the
        answer should not be trusted. Most systems cannot show you this at all.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <figure className="m-0">
          <div className="aspect-square overflow-hidden rounded-lg border border-line bg-ground">
            <img
              src={imageUrl}
              alt="Uploaded skin lesion"
              className="size-full object-cover"
            />
          </div>
          <figcaption className="mt-2 text-xs text-muted">Original image</figcaption>
        </figure>

        <figure className="m-0">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-line bg-ground">
            <img
              src={imageUrl}
              alt="Uploaded skin lesion with attention overlay"
              className="size-full object-cover"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: heatmapGradient(focus), opacity }}
            />
          </div>
          <figcaption className="mt-2 text-xs text-muted">
            Where it looked — illustration only, not yet a real heatmap
          </figcaption>
        </figure>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <label htmlFor={sliderId} className="text-sm font-medium">
          Overlay strength
        </label>
        <input
          id={sliderId}
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="h-11 min-w-40 flex-1 accent-[#0e7c7b]"
        />
        <span className="w-12 text-end font-mono text-xs text-muted">
          {Math.round(opacity * 100)}%
        </span>
      </div>
    </section>
  );
}
