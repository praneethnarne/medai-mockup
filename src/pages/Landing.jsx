import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import FooterNote from "../components/FooterNote.jsx";
import DemoBadge from "../components/DemoBadge.jsx";

const icon = {
  camera: (
    <>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  route: (
    <>
      <path d="M5 19V9a4 4 0 014-4h6" strokeLinecap="round" />
      <path d="M13 2l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5" cy="19" r="1.8" />
    </>
  ),
};

const steps = [
  ["camera", "Take a photo", "Any clear phone photo of one spot."],
  ["eye", "See the answer — and why", "The likely type, plus a heatmap of where it looked."],
  ["route", "Know what to do", "One clear next step, from “keep an eye on it” to “see a doctor now”."],
];

const trust = [
  ["Built for phone photos", "Trained and tested on real smartphone images, not only clinic scans."],
  ["Shows its reasoning", "Every answer comes with the part of the photo that drove it."],
  ["Says when it's unsure", "Below its confidence threshold, it refers you instead of guessing."],
];

function Icon({ name }) {
  return (
    <span className="flex size-11 items-center justify-center rounded-xl bg-accent-wash text-accent-dark">
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        {icon[name]}
      </svg>
    </span>
  );
}

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <Logo />
          <div className="ms-auto flex items-center gap-2">
            <DemoBadge compact />
            <Link
              to="/signin"
              className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-muted hover:bg-ground hover:text-ink"
            >
              Demo sign-in
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="landing-hero mx-auto grid w-full max-w-5xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pt-20 md:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="text-4xl font-extrabold tracking-tight text-accent sm:text-5xl">MEdAI</p>
            <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] sm:text-5xl">
              Worried about a spot on your skin?
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Take a photo. MEdAI tells you what it most likely is, shows why, and what to do next.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/detect"
                className="flex min-h-12 items-center rounded-full bg-accent px-7 text-base font-semibold text-white shadow-[0_8px_20px_-8px_rgb(15_118_110/0.6)] hover:bg-accent-dark"
              >
                Check a spot
              </Link>
              <Link to="/dashboard" className="text-sm font-medium text-accent-dark hover:underline">
                View past scans
              </Link>
            </div>
          </div>

          <figure className="m-0" aria-label="Example result">
            <div className="relative rounded-3xl border border-line bg-surface p-5 shadow-[0_24px_60px_-30px_rgb(20_24_31/0.35)]">
              <div className="flex items-center gap-4">
                <img src="/samples/arm_nevus.jpg" alt="" className="size-16 rounded-xl object-cover" />
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Most likely</p>
                  <p className="text-xl font-bold">Ordinary mole</p>
                </div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-routine-wash">
                <span className="block h-full w-[92%] rounded-full bg-accent" />
              </div>
              <div className="mt-4 rounded-xl bg-routine-wash px-4 py-3 text-sm">
                <span className="font-semibold">Monitor it</span>
                <span className="text-muted"> · mention at your next visit</span>
              </div>
            </div>
            <figcaption className="mt-3 text-center text-xs text-muted">Example result (illustration)</figcaption>
          </figure>
        </section>

        <section className="border-y border-line bg-surface">
          <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted">How it works</h2>
            <ol className="mt-6 grid gap-8 sm:grid-cols-3">
              {steps.map(([ic, title, body], i) => (
                <li key={title}>
                  <Icon name={ic} />
                  <p className="mt-4 font-mono text-xs text-muted">Step {i + 1}</p>
                  <h3 className="mt-1 text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight">What it looks for</h2>
          <p className="mt-2 text-muted">Most spots are harmless. A few are not.</p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6">
            {[
              ["/samples/arm_nevus.jpg", "Usually harmless", "Round, one even colour, smooth edge.", "bg-accent"],
              ["/samples/arm_melanoma.jpg", "Get it checked", "Lopsided, several colours, ragged edge.", "bg-urgent"],
            ].map(([src, title, body, dot]) => (
              <figure key={src} className="m-0">
                <img
                  src={src}
                  alt={`${title}: ${body}`}
                  className="block aspect-square w-full rounded-2xl border border-line object-cover"
                />
                <figcaption className="mt-3">
                  <span className="flex items-center gap-2 font-semibold">
                    <span aria-hidden="true" className={`size-2.5 rounded-full ${dot}`} />
                    {title}
                  </span>
                  <span className="mt-1 block text-sm text-muted">{body}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">Illustrations.</p>
        </section>

        <section className="border-t border-line bg-surface">
          <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6">
            {trust.map(([title, body]) => (
              <div key={title}>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 text-xs leading-relaxed text-muted sm:px-6">
          <FooterNote />
        </div>
      </footer>
    </div>
  );
}
