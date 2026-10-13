import { Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import TriageBadge from "../components/TriageBadge.jsx";
import Disclaimer from "../components/Disclaimer.jsx";
import { readHistory } from "../lib/history.js";
import { LOW_CONFIDENCE_THRESHOLD } from "../lib/mockPredict.js";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  const rows = readHistory();

  return (
    <Layout wide>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Scan history</h1>
          <p className="mt-1.5 text-sm text-muted">
            Previous screenings and their outcomes.
          </p>
        </div>
        <Link
          to="/detect"
          className="flex min-h-11 items-center rounded-md bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
        >
          New scan
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <ul className="divide-y divide-line">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                to={`/result/${row.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 transition-colors hover:bg-ground"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{row.name}</span>
                  <span className="mt-0.5 block text-xs text-muted">
                    <span className="font-mono">{row.predicted}</span> · {row.region} ·{" "}
                    {formatDate(row.createdAt)}
                  </span>
                </span>
                <span className="font-mono text-sm text-muted">
                  {(row.confidence * 100).toFixed(1)}%
                </span>
                {row.confidence < LOW_CONFIDENCE_THRESHOLD ? (
                  <span className="inline-flex min-h-7 items-center gap-2 rounded-full border border-line bg-ground px-3 text-xs font-medium text-muted">
                    Too uncertain to triage
                  </span>
                ) : (
                  <TriageBadge triage={row.triage} size="sm" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-xs text-muted">
        Rows marked as earlier dates are seeded sample data for this demo.
      </p>

      <Disclaimer className="mt-8" />
    </Layout>
  );
}
