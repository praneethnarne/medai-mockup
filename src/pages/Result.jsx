import { Link, useLocation, useParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import GradcamPanel from "../components/GradcamPanel.jsx";
import CareGuidance from "../components/CareGuidance.jsx";
import ProbabilityBars from "../components/ProbabilityBars.jsx";
import Section, { More } from "../components/Section.jsx";
import { CONDITIONS, DISCLAIMER } from "../data/conditions.js";
import { EMERGENCY, GROUPS } from "../data/groups.js";
import { LOW_CONFIDENCE_THRESHOLD } from "../lib/mockPredict.js";
import { readHistory, readScan } from "../lib/history.js";

const pct = (v) => `${(v * 100).toFixed(1)}%`;
const whole = (v) => `${Math.round(v * 100)}%`;

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

// The score as a bar, with a tick where the model's answer threshold sits:
// shows at a glance why it answered (or did not) without a paragraph.
// The model answers when it is sure enough of the RISK GROUP (cancer / pre-cancer /
// harmless), not of the single type -- that is how the threshold was calibrated. So the
// bar and the pass mark show the risk-group score; the type's own score sits beside it.
function ConfidenceMeter({ value, groupValue, threshold }) {
  const bar = groupValue ?? value;
  const passed = bar >= threshold;
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-mono text-3xl font-medium tabular-nums">{whole(bar)}</span>
        <span className="text-sm text-muted">
          {groupValue != null ? "sure of the risk group" : "match score"}
        </span>
        {groupValue != null && (
          <span className="ms-auto text-xs text-muted">this exact type: {whole(value)}</span>
        )}
      </div>
      <div className="relative mt-2 h-2.5 rounded-full bg-routine-wash">
        <span
          className={`absolute inset-y-0 left-0 rounded-full ${passed ? "bg-accent" : "bg-urgent"}`}
          style={{ width: `${Math.max(bar * 100, 2)}%` }}
        />
        <span
          aria-hidden="true"
          className="absolute -top-1 h-4.5 w-0.5 rounded bg-ink"
          style={{ left: `${threshold * 100}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-muted">
        Answers only above {whole(threshold)}
      </p>
    </div>
  );
}

function Hero({ result, condition, threshold }) {
  const photo = result.cropUrl ?? result.imageUrl;
  return (
    <section className="result-hero rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <div className="flex items-center gap-5">
        {photo && (
          <img
            src={photo}
            alt="Your photo"
            className="size-20 shrink-0 rounded-xl object-cover sm:size-24"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Most likely</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-4xl">{condition.name}</h1>
        </div>
      </div>
      <p className="mt-4 max-w-xl text-base text-muted">{condition.plain}</p>
      <div className="mt-5 border-t border-line pt-5">
        <ConfidenceMeter
          value={result.confidence}
          groupValue={result.triage ? Math.max(...Object.values(result.triage)) : null}
          threshold={threshold}
        />
      </div>
    </section>
  );
}

function RiskMix({ triage }) {
  const parts = [
    ["malignant", "Cancer", "bg-urgent"],
    ["indeterminate", "Pre-cancer", "bg-prompt"],
    ["benign", "Harmless", "bg-accent"],
  ];
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-routine-wash">
        {parts.map(([key, , bar]) => (
          <span key={key} className={bar} style={{ width: `${(triage[key] ?? 0) * 100}%` }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {parts.map(([key, label, bar]) => (
          <li key={key} className="flex items-center gap-2">
            <span aria-hidden="true" className={`size-2.5 rounded-full ${bar}`} />
            <span className="text-muted">{label}</span>
            <span className="font-mono text-xs">{whole(triage[key] ?? 0)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GroupGuidance({ group, confidence }) {
  const g = GROUPS[group];
  return (
    <>
      <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">Looks like</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{g.name}</h1>
            <p className="mt-2 max-w-md text-base text-muted">{g.plain}</p>
          </div>
          <p className="font-mono text-4xl font-medium tabular-nums">{whole(confidence)}</p>
        </div>
      </section>
      <Section step="1" title="What to do next" why={g.headline}>
        <p className="rounded-xl bg-ground p-4 text-sm">{g.seekCare}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <More label="Get emergency help if">
            <ul className="flex list-disc flex-col gap-1.5 ps-5 text-sm text-muted">
              {EMERGENCY.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </More>
          <More label="What you can do now">
            <ul className="flex list-disc flex-col gap-1.5 ps-5 text-sm text-muted">
              {g.selfCare.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </More>
        </div>
      </Section>
    </>
  );
}

function Notice({ tone, title, children }) {
  const styles = {
    prompt: "border-prompt/30 bg-prompt-wash text-prompt",
    urgent: "border-urgent/30 bg-urgent-wash text-urgent",
  };
  return (
    <section className={`rounded-2xl border p-5 sm:p-7 ${styles[tone]}`}>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <div className="mt-2 max-w-prose text-base text-ink">{children}</div>
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
  const nTypes = Object.keys(result.probabilities ?? {}).length;
  const showSpot = status === "answer" && condition && !isGroupAnswer;

  let step = 0;
  const next = () => String((step += 1));

  return (
    <Layout>
      <div className="mb-5">
        <Link to="/dashboard" className="text-sm font-medium text-accent-dark hover:underline">
          ← History
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {status === "unfamiliar" && (
          <Notice tone="prompt" title="I don't recognise this image">
            It doesn't look like the skin spots MEdAI was trained on, so it won't treat this as a
            reliable answer.
            {condition && <> Closest match: <b className="font-semibold">{condition.name}</b>.</>}{" "}
            If you're worried, show it to a doctor. Or retake it: good light, spot filling the frame.
          </Notice>
        )}

        {status === "unsure" && (
          <Notice tone="urgent" title="Not sure enough to answer">
            The score was below the {whole(threshold)} it needs.
            {condition && <> Best guess: <b className="font-semibold">{condition.name}</b>, but that isn't reliable.</>}{" "}
            Not reassurance — if it worries you, see a doctor.
          </Notice>
        )}

        {isGroupAnswer && <GroupGuidance group={kind.top} confidence={kind.confidence} />}

        {showSpot && (
          <>
            <Hero result={result} condition={condition} threshold={threshold} />
            <CareGuidance code={result.predicted} step={next()} />
          </>
        )}

        {!showSpot && condition && status !== "answer" && !isGroupAnswer && (
          <Hero result={result} condition={condition} threshold={threshold} />
        )}

        {result.imageUrl || result.cropUrl || result.heatUrl ? (
          <GradcamPanel
            step={next()}
            imageUrl={result.imageUrl}
            focus={result.focus}
            cropUrl={result.cropUrl}
            heatUrl={result.heatUrl}
          />
        ) : (
          <Section title="Why it gave this answer" why="Sample history keeps no photo. Run a new scan to see the heatmap." />
        )}

        {result.probabilities && nTypes > 1 && (
          <Section
            step={next()}
            title="How sure it is"
            why="If second place is close, treat the answer with caution."
          >
            {status === "answer" && result.triage && (
              <div className="mb-5">
                <p className="mb-2 text-sm font-medium">Overall risk</p>
                <RiskMix triage={result.triage} />
              </div>
            )}
            <p className="mb-2 text-sm font-medium">Top matches</p>
            <ProbabilityBars probabilities={result.probabilities} predicted={result.predicted} limit={3} />
            {nTypes > 3 && (
              <More label={`Show all ${nTypes} types`} className="mt-4">
                <ProbabilityBars probabilities={result.probabilities} predicted={result.predicted} />
              </More>
            )}
          </Section>
        )}

        <More label="Technical details">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
            <div>
              <dt className="text-muted">Source</dt>
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
            <div>
              <dt className="text-muted">Answer threshold</dt>
              <dd className="mt-0.5 font-mono">
                {whole(threshold)} {live ? (result.calibrated ? "(calibrated)" : "(uncalibrated)") : ""}
              </dd>
            </div>
            {result.confidence != null && (
              <div>
                <dt className="text-muted">Exact score</dt>
                <dd className="mt-0.5 font-mono">{pct(result.confidence)}</dd>
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
          {nTypes > 1 && (
            <p className="mt-3 text-xs text-muted">
              The match score ranks the {nTypes} types against each other. It is not the
              chance that you have the condition.
            </p>
          )}
        </More>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          to="/detect"
          className="flex min-h-12 items-center rounded-lg bg-accent px-6 font-medium text-white transition-colors hover:bg-accent-dark"
        >
          Scan another photo
        </Link>
        <p className="text-xs text-muted">{DISCLAIMER}</p>
      </div>
    </Layout>
  );
}
