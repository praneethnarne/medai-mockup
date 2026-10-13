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
            Photograph a mole or a mark on your skin. MEdAI tells you which of seven
            common types it most resembles, shows you which part of the photo it
            based that on, and tells you what to do about it — including when the
            honest answer is that it does not know.
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


        <section className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
            <h2 className="text-2xl font-bold tracking-tight">
              First, what is a skin lesion?
            </h2>
            <div className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
              <p>
                It is any spot, mole or patch on your skin that looks different from the
                skin around it. A mole is one. A freckle is one. A dry, scaly patch is
                one.
              </p>
              <p className="mt-3">
                It is <strong className="font-semibold text-ink">not</strong> a cut, a
                wound or a rash. Nothing here is about injuries.
              </p>
              <p className="mt-3">
                Almost all of these spots are harmless. A few are not. The job is telling
                which is which.
              </p>
            </div>

            <h3 className="mt-10 text-lg font-semibold">
              Step one: you notice a spot
            </h3>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
              Both of these are on a forearm. One is nothing to worry about. The other
              needs a doctor.
            </p>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <figure className="m-0">
                <div className="overflow-hidden rounded-xl border border-line">
                  <img
                    src="/samples/arm_nevus.jpg"
                    alt="A forearm with a small, round, evenly coloured brown mole"
                    className="block aspect-square w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3">
                  <span className="font-semibold">An ordinary mole</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    Round, one even shade of brown, smooth edge.
                  </span>
                </figcaption>
              </figure>
              <figure className="m-0">
                <div className="overflow-hidden rounded-xl border border-line">
                  <img
                    src="/samples/arm_melanoma.jpg"
                    alt="A forearm with a large lopsided mole in several shades of brown and black with a ragged edge"
                    className="block aspect-square w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3">
                  <span className="font-semibold">One to get checked</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    Lopsided, several shades, ragged edge.
                  </span>
                </figcaption>
              </figure>
            </div>
            <p className="mt-3 text-xs text-muted">
              Illustrations, drawn to show the difference clearly.
            </p>

            <h3 className="mt-12 text-lg font-semibold">
              Step two: what the system actually looks at
            </h3>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
              Doctors photograph the spot through a dermatoscope — a magnifier with a
              light held against the skin. These are real clinical images from the public
              ISIC Archive, the same source as the data this project trains on.
            </p>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <figure className="m-0">
                <div className="overflow-hidden rounded-xl border border-line">
                  <img
                    src="/samples/real_nevus.jpg"
                    alt="Magnified clinical photograph of a benign mole"
                    className="block aspect-[4/3] w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3">
                  <span className="font-semibold">Harmless mole</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    Even pattern, fading evenly outwards.
                  </span>
                </figcaption>
              </figure>
              <figure className="m-0">
                <div className="overflow-hidden rounded-xl border border-line">
                  <img
                    src="/samples/real_melanoma.jpg"
                    alt="Magnified clinical photograph of a melanoma"
                    className="block aspect-[4/3] w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3">
                  <span className="font-semibold">Melanoma</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    Patchy and uneven, with colour that stops and starts.
                  </span>
                </figcaption>
              </figure>
            </div>

            <p className="mt-6 max-w-2xl rounded-lg border border-line bg-ground p-4 text-sm leading-relaxed text-muted">
              <strong className="font-semibold text-ink">
                Notice how much harder the second pair is.
              </strong>{" "}
              In real clinical images the difference between harmless and dangerous is
              subtle, and specialists disagree with each other regularly. That difficulty
              is the reason this project is worth building.
            </p>
          </div>
        </section>

        <section className="border-b border-line bg-surface">
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
