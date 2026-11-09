import { Link, useLocation, useParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import GradcamPanel from "../components/GradcamPanel.jsx";
import CareGuidance from "../components/CareGuidance.jsx";
import ProbabilityBars from "../components/ProbabilityBars.jsx";
import DemoBadge from "../components/DemoBadge.jsx";
import TriageBadge from "../components/TriageBadge.jsx";
import { CONDITIONS, DISCLAIMER } from "../data/conditions.js";
import { EMERGENCY, GROUPS } from "../data/groups.js";
import { LOW_CONFIDENCE_THRESHOLD } from "../lib/mockPredict.js";
import { readHistory, readScan } from "../lib/history.js";

const pct = (v) => `${(v * 100).toFixed(1)}%`;

function fromSeededRow(id) {
  const row = readHistory().find((r) => r.id === id);
  if (!row) return null;
  return {
    id: row.id,
    status: row.confidence < LOW_CONFIDENCE_THRESHOLD ? "unsure" : "answer",
    predicted: row.predicted,
    confidence: row.confidence,
    threshold: LOW_CONFIDENCE_THRESHOLD,
    probabilities: { [row.predicted]: row.confidence },
    model: "efficientnet_b0",
    createdAt: row.createdAt,
    imageUrl: null,
    simulated: true,
  };
}

// Older saved results and simulated ones may lack `status`.
function statusOf(r) {
  if (r.status) return r.status;
  return r.lowConfidence ? "unsure" : "answer";
}

function TriageCard({ triage }) {
  const rows = [
    ["malignant", "Malignant — the kind a doctor must see", "bg-urgent"],
    ["indeterminate", "Pre-cancerous — should be checked", "bg-prompt"],
    ["benign", "Benign — usually harmless", "bg-accent"],
  ];
  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="mb-1 text-base font-semibold">How worrying it looks</h2>
      <p className="mb-5 max-w-prose text-sm leading-relaxed text-muted">
        The eight types grouped by what they mean for you. The advice below follows the
        most likely type.
      </p>
      <ul className="flex flex-col gap-3">
        {rows.map(([key, label, bar]) => {
          const v = triage[key] ?? 0;
          return (
            <li key={key} className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="w-full text-sm sm:w-72 sm:shrink-0">{label}</span>
              <span className="block h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-routine-wash">
                <span
                  className={`block h-full rounded-full ${bar}`}
                  style={{ width: `${Math.max(v * 100, 1.5)}%` }}
                />
              </span>
              <span className="w-14 shrink-0 text-end font-mono text-xs">{pct(v)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function EmergencyBox() {
  return (
    <div className="rounded-lg border border-urgent/30 bg-urgent-wash p-4">
      <h3 className="mb-2 text-sm font-semibold text-urgent">
        Get emergency help now if any of these apply
      </h3>
      <ul className="flex list-disc flex-col gap-1.5 ps-5">
        {EMERGENCY.map((x) => (
          <li key={x} className="text-sm leading-relaxed text-ink">
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

function GroupGuidance({ group, confidence }) {
  const g = GROUPS[group];
  return (
    <section className="rounded-xl border border-line border-s-4 border-s-accent bg-surface p-5 sm:p-6">
      <p className="mb-2 font-mono text-xs tracking-wide text-muted">
        WHAT KIND OF THING THIS LOOKS LIKE
      </p>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{g.name}</h1>
          <p className="mt-2 max-w-md text-base leading-relaxed">{g.plain}</p>
        </div>
        <div className="text-end">
          <p className="font-mono text-3xl font-medium tabular-nums">{pct(confidence)}</p>
          <p className="mt-1 text-xs text-muted">how sure it is</p>
        </div>
      </div>
      <h2 className="mb-3 mt-6 text-base font-semibold">{g.headline}</h2>
      <EmergencyBox />
      <div className="mt-5 rounded-lg bg-ground p-4">
        <h3 className="mb-1.5 text-sm font-semibold">When to get it checked</h3>
        <p className="max-w-prose text-sm leading-relaxed text-muted">{g.seekCare}</p>
      </div>
      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold">What you can do now</h3>
          <ul className="flex list-disc flex-col gap-1.5 ps-5 text-sm text-muted">
            {g.selfCare.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold">See a doctor sooner if</h3>
          <ul className="flex list-disc flex-col gap-1.5 ps-5 text-sm text-muted">
            {g.redFlags.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-muted">
        This follows a prediction that may be wrong. {DISCLAIMER}
      </p>
    </section>
  );
}

export default function Result() {
  const { id } = useParams();
  const location = useLocation();
  const result = location.state?.result ?? readScan(id) ?? fromSeededRow(id);

  if (!result) {
    return (
      <Layout>
        <h1 className="text-2xl font-bold tracking-tight">Result not found</h1>
        <p className="mt-2 text-sm text-muted">Results are kept for the current tab only.</p>
        <Link
          to="/detect"
          className="mt-6 inline-flex min-h-11 items-center rounded-md bg-accent px-4 text-sm font-medium text-white hover:bg-accent-dark"
        >
          Run a new scan
        </Link>
      </Layout>
    );
  }

  const status = statusOf(result);
  const live = result.simulated === false;
  const kind = result.kind;
  const isGroupAnswer = status === "answer" && kind && kind.top !== "spot_growth";
  const condition = result.predicted ? CONDITIONS[result.predicted] : null;
  const threshold = result.threshold ?? LOW_CONFIDENCE_THRESHOLD;
  const nTypes = Object.keys(result.probabilities ?? {}).length || 8;

  return (
    <Layout wide>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link to="/dashboard" className="text-sm font-medium text-accent-dark underline">
          ← History
        </Link>
        <DemoBadge className="ms-auto" live={live} />
      </div>

      {status === "unfamiliar" && (
        <section className="mb-6 rounded-xl border border-prompt/30 border-s-4 border-s-prompt bg-prompt-wash p-5 sm:p-6">
          <h1 className="text-xl font-bold tracking-tight text-prompt">
            I don't recognise this image
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink">
            This photo does not look like anything MEdAI was trained on, so it gives no
            answer rather than a guess. It may be a scar, wound, rash, bite, another skin
            condition, or a photo that is too blurred, dark or far away.
          </p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">
            If you are worried about it, show it to a doctor or pharmacist. A retake can help:
            good light, the spot filling most of the frame, no flash glare.
          </p>
        </section>
      )}

      {status === "unsure" && (
        <section className="mb-6 rounded-xl border border-urgent/30 border-s-4 border-s-urgent bg-urgent-wash p-5 sm:p-6">
          <h1 className="text-xl font-bold tracking-tight text-urgent">
            Not confident enough to answer — please see a doctor
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink">
            The model's score was below the{" "}
            <span className="font-mono">{Math.round(threshold * 100)}%</span> it needs to answer
            {live && result.calibrated
              ? " (a threshold chosen from validation data so that cancers are flagged or referred)"
              : ""}
            .
            {condition ? (
              <>
                {" "}
                Its best guess was <span className="font-medium">{condition.name}</span>, but that
                is not reliable.
              </>
            ) : kind ? (
              <>
                {" "}
                Its best guess was <span className="font-medium">{GROUPS[kind.top]?.name}</span>.
              </>
            ) : null}{" "}
            That is not reassurance: if the spot worries you, or it has changed, have it looked
            at.
          </p>
        </section>
      )}

      {isGroupAnswer && (
        <div className="mb-6">
          <GroupGuidance group={kind.top} confidence={kind.confidence} />
        </div>
      )}

      {status === "answer" && condition && (
        <section className="mb-6 rounded-xl border border-line bg-surface p-5 sm:p-6">
          <p className="mb-2 font-mono text-xs tracking-wide text-muted">
            IF THIS IS A SKIN SPOT OR GROWTH, IT LOOKS MOST LIKE
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{condition.name}</h1>
              <p className="mt-2 max-w-md text-base leading-relaxed">{condition.plain}</p>
              <div className="mt-3">
                <TriageBadge triage={condition.triage} size="sm" />
              </div>
            </div>
            <div className="text-end">
              <p className="font-mono text-3xl font-medium tabular-nums">
                {pct(result.confidence)}
              </p>
              <p className="mt-1 text-xs text-muted">how sure it is</p>
            </div>
          </div>
          <p className="mt-4 border-t border-line pt-4 text-xs leading-relaxed text-muted">
            “{pct(result.confidence)} sure” means the system rated this type well ahead of the
            other {nTypes - 1}. It does not mean there is a {pct(result.confidence)} chance you
            have it. Scar, wound, rash or bite? This result does not apply.
          </p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">
            {condition.whatItIs}
          </p>
        </section>
      )}

      <div className="flex flex-col gap-6">
        {result.imageUrl ? (
          <GradcamPanel
            imageUrl={result.imageUrl}
            focus={result.focus}
            cropUrl={result.cropUrl}
            heatUrl={result.heatUrl}
          />
        ) : (
          <section className="rounded-xl border border-line bg-surface p-5 text-sm text-muted sm:p-6">
            <h2 className="mb-1.5 text-base font-semibold text-ink">Visual explanation</h2>
            This is sample history, so the original image was never stored. Run a new scan to see
            where the model looked.
          </section>
        )}

        {status === "answer" && result.triage && <TriageCard triage={result.triage} />}

        {status === "answer" && condition && <CareGuidance code={result.predicted} />}

        {result.probabilities && status !== "unfamiliar" && (
          <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
            <h2 className="mb-1 text-base font-semibold">What else it considered</h2>
            <p className="mb-5 max-w-prose text-sm leading-relaxed text-muted">
              The system scores all {nTypes} types and picks the highest. If second place is
              close behind, that is worth paying attention to rather than ignoring.
            </p>
            <ProbabilityBars probabilities={result.probabilities} predicted={result.predicted} />
          </section>
        )}

        <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
          <dl className="flex flex-wrap gap-x-8 gap-y-3 text-xs">
            <div>
              <dt className="text-muted">Results from</dt>
              <dd className="mt-0.5 font-mono">{live ? "trained model (live)" : "simulation"}</dd>
            </div>
            <div>
              <dt className="text-muted">Model</dt>
              <dd className="mt-0.5 font-mono">{result.model}</dd>
            </div>
            {kind && (
              <div>
                <dt className="text-muted">Step 1 model</dt>
                <dd className="mt-0.5 font-mono">{kind.model}</dd>
              </div>
            )}
            {live && (
              <div>
                <dt className="text-muted">Confidence needed to answer</dt>
                <dd className="mt-0.5 font-mono">
                  {Math.round(threshold * 100)}% {result.calibrated ? "(calibrated)" : "(uncalibrated)"}
                </dd>
              </div>
            )}
            {result.inferenceMs && (
              <div>
                <dt className="text-muted">Time to decide</dt>
                <dd className="mt-0.5 font-mono">{result.inferenceMs} ms</dd>
              </div>
            )}
            <div>
              <dt className="text-muted">Scan reference</dt>
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
