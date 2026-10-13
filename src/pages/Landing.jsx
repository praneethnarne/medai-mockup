import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import Disclaimer from "../components/Disclaimer.jsx";
import DemoBadge from "../components/DemoBadge.jsx";

const contributions = [
  {
    title: "It shows its reasoning",
    body: "Every prediction comes with a Grad-CAM heatmap over the regions that drove it, so you can tell whether the model looked at the lesion or at something irrelevant.",
  },
  {
    title: "It runs small",
    body: "We compare lightweight architectures on accuracy against model size and inference latency, and deploy the one that holds accuracy at a fraction of the footprint.",
  },
  {
    title: "It tells you what to do",
    body: "A prediction alone helps nobody. Each result carries a triage tier, practical steps for the wait, and the specific changes that mean you should be seen sooner.",
  },
];

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Logo />
          <div className="ms-auto flex items-center gap-2">
            <DemoBadge className="hidden sm:inline-flex" />
            <Link
              to="/signin"
              className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-muted hover:bg-ground hover:text-ink"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-20">
          <p className="mb-4 font-mono text-xs tracking-wide text-accent-dark">
            EXPLAINABLE AI FOR DERMATOLOGICAL SCREENING
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            Know what the model saw, and know what to do about it.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            MEdAI classifies a dermatoscopic image into one of seven lesion
            categories, shows the regions behind its prediction, and turns that
            result into concrete next steps. It is a screening aid that is honest
            about its uncertainty.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/detect"
              className="flex min-h-12 items-center rounded-md bg-accent px-5 font-medium text-white transition-colors hover:bg-accent-dark"
            >
              Try a scan
            </Link>
            <Link
              to="/dashboard"
              className="flex min-h-12 items-center rounded-md border border-line bg-surface px-5 font-medium transition-colors hover:bg-ground"
            >
              View history
            </Link>
          </div>
        </section>

        <section className="border-y border-line bg-surface">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6 sm:py-14">
            {contributions.map((item, i) => (
              <article key={item.title}>
                <span className="font-mono text-xs text-muted">
                  0{i + 1}
                </span>
                <h2 className="mb-2 mt-3 text-base font-semibold">{item.title}</h2>
                <p className="text-sm leading-relaxed text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <Disclaimer />
        </section>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-xs leading-relaxed text-muted sm:px-6">
          Final-year project, MLR Institute of Technology. Interface mockup with
          simulated inference; no trained model is connected.
        </div>
      </footer>
    </div>
  );
}
