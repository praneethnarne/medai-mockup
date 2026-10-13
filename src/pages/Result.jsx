import { Link, useLocation, useParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import GradcamPanel from "../components/GradcamPanel.jsx";
import CareGuidance from "../components/CareGuidance.jsx";
import ProbabilityBars from "../components/ProbabilityBars.jsx";
import DemoBadge from "../components/DemoBadge.jsx";
import { CONDITIONS } from "../data/conditions.js";
import { LOW_CONFIDENCE_THRESHOLD } from "../lib/mockPredict.js";
import { readHistory, readScan } from "../lib/history.js";

function fromSeededRow(id) {
  const row = readHistory().find((r) => r.id === id);
  if (!row) return null;
  return {
    id: row.id,
    predicted: row.predicted,
    confidence: row.confidence,
    lowConfidence: row.confidence < LOW_CONFIDENCE_THRESHOLD,
    probabilities: { [row.predicted]: row.confidence },
    model: "efficientnet_b0",
    createdAt: row.createdAt,
    imageUrl: null,
    simulated: true,
  };
}

export default function Result() {
  const { id } = useParams();
  const location = useLocation();
  const result = location.state?.result ?? readScan(id) ?? fromSeededRow(id);

  if (!result) {
    return (
      <Layout>
        <h1 className="text-2xl font-bold tracking-tight">Result not found</h1>
        <p className="mt-2 text-sm text-muted">
          This demo keeps results for the current tab only.
        </p>
        <Link
          to="/detect"
          className="mt-6 inline-flex min-h-11 items-center rounded-md bg-accent px-4 text-sm font-medium text-white hover:bg-accent-dark"
        >
          Run a new scan
        </Link>
      </Layout>
    );
  }

  const condition = CONDITIONS[result.predicted];
  const pct = (result.confidence * 100).toFixed(1);

  return (
    <Layout wide>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link to="/dashboard" className="text-sm font-medium text-accent-dark underline">
          ← History
        </Link>
        <DemoBadge className="ms-auto" />
      </div>

      {result.lowConfidence ? (
        <section className="mb-6 rounded-xl border border-urgent/30 border-s-4 border-s-urgent bg-urgent-wash p-5 sm:p-6">
          <h1 className="text-xl font-bold tracking-tight text-urgent">
            This result is not reliable enough to act on
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink">
            The model's highest score is only{" "}
            <span className="font-mono font-medium">{pct}%</span>, below the{" "}
            <span className="font-mono">
              {LOW_CONFIDENCE_THRESHOLD * 100}%
            </span>{" "}
            threshold we treat as usable. Its best guess was{" "}
            <span className="font-medium">{condition.name}</span>, but it is close to
            guessing. Please have the lesion looked at by a clinician rather than
            relying on this screening.
          </p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">
            A retake often helps: good lighting, the lesion filling most of the frame,
            and no flash glare.
          </p>
        </section>
      ) : (
        <section className="mb-6 rounded-xl border border-line bg-surface p-5 sm:p-6">
          <p className="mb-2 font-mono text-xs tracking-wide text-muted">
            MOST LIKELY CATEGORY
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{condition.name}</h1>
              <p className="mt-1.5 font-mono text-sm text-muted">
                {condition.code} · {condition.malignant ? "malignant / pre-cancerous" : "benign"}
              </p>
            </div>
            <div className="text-end">
              <p className="font-mono text-3xl font-medium tabular-nums">{pct}%</p>
              <p className="mt-1 text-xs text-muted">confidence</p>
            </div>
          </div>
          <p className="mt-4 max-w-prose border-t border-line pt-4 text-sm leading-relaxed text-muted">
            {condition.whatItIs}
          </p>
        </section>
      )}

      <div className="flex flex-col gap-6">
        {result.imageUrl ? (
          <GradcamPanel imageUrl={result.imageUrl} focus={result.focus} />
        ) : (
          <section className="rounded-xl border border-line bg-surface p-5 text-sm text-muted sm:p-6">
            <h2 className="mb-1.5 text-base font-semibold text-ink">
              Visual explanation
            </h2>
            This is seeded sample history, so the original image was never stored. Run a
            new scan to see the Grad-CAM panel.
          </section>
        )}

        <CareGuidance code={result.predicted} />

        <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="mb-1 text-base font-semibold">All categories</h2>
          <p className="mb-5 max-w-prose text-sm leading-relaxed text-muted">
            The model scores every category. A close second place is a reason for
            caution, not a detail to ignore.
          </p>
          <ProbabilityBars
            probabilities={result.probabilities}
            predicted={result.predicted}
          />
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-4 text-xs">
            <div>
              <dt className="text-muted">Model</dt>
              <dd className="mt-0.5 font-mono">{result.model}</dd>
            </div>
            {result.inferenceMs && (
              <div>
                <dt className="text-muted">Inference time</dt>
                <dd className="mt-0.5 font-mono">{result.inferenceMs} ms</dd>
              </div>
            )}
            <div>
              <dt className="text-muted">Scan ID</dt>
              <dd className="mt-0.5 font-mono">{result.id}</dd>
            </div>
          </dl>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/detect"
          className="flex min-h-12 items-center rounded-md bg-accent px-5 font-medium text-white transition-colors hover:bg-accent-dark"
        >
          Scan another image
        </Link>
        <Link
          to="/dashboard"
          className="flex min-h-12 items-center rounded-md border border-line bg-surface px-5 font-medium transition-colors hover:bg-ground"
        >
          Back to history
        </Link>
      </div>
    </Layout>
  );
}
