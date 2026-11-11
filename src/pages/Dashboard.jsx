import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import TriageBadge from "../components/TriageBadge.jsx";
import { readHistory } from "../lib/history.js";
import { LOW_CONFIDENCE_THRESHOLD } from "../lib/mockPredict.js";

function formatWhen(iso, seeded) {
  const d = new Date(iso);
  if (seeded) {
    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Dashboard() {
  const rows = readHistory();

  return (
    <Layout wide>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your scans</h1>
          <p className="mt-1.5 text-sm text-muted">
            Tap a scan to see its result again.
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
          <p className="text-base text-muted">No scans yet.</p>
          <Link
            to="/detect"
            className="mt-5 inline-flex min-h-11 items-center rounded-md bg-accent px-5 text-sm font-medium text-white hover:bg-accent-dark"
          >
            New scan
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => {
            const unsure = (row.confidence ?? 0) < LOW_CONFIDENCE_THRESHOLD;
            const live = row.simulated === false;
            return (
              <li key={row.id}>
                <Link
                  to={`/result/${row.id}`}
                  className="card-hover flex h-full flex-col rounded-2xl border border-line bg-surface p-5"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-muted">
                    <span className="truncate">{row.region ?? "This session"}</span>
                    <span className="shrink-0">{formatWhen(row.createdAt, row.seeded)}</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold">{row.name}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="block h-1.5 flex-1 rounded-full bg-routine-wash">
                      <span
                        className={`block h-full rounded-full ${unsure ? "bg-muted/40" : "bg-accent"}`}
                        style={{ width: `${(row.confidence ?? 0) * 100}%` }}
                      />
                    </span>
                    <span className="font-mono text-xs text-muted">
                      {Math.round((row.confidence ?? 0) * 100)}%
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {row.seeded && (
                      <span className="inline-flex min-h-7 items-center rounded-full border border-line bg-ground px-2.5 text-xs font-medium text-muted">
                        Sample
                      </span>
                    )}
                    {live && (
                      <span className="inline-flex min-h-7 items-center rounded-full border border-accent/30 bg-accent-wash px-2.5 text-xs font-medium text-accent-dark">
                        Live
                      </span>
                    )}
                    {unsure ? (
                      <span className="inline-flex min-h-7 items-center rounded-full border border-line bg-ground px-3 text-xs font-medium text-muted">
                        Too uncertain to triage
                      </span>
                    ) : (
                      <TriageBadge triage={row.triage} size="sm" />
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-4 text-xs text-muted">
        Rows marked Sample are demo data. Live rows came from the trained model in this tab.
      </p>
    </Layout>
  );
}
