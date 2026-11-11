// Demo scan history. Session-scoped: seeded rows plus anything scanned in this
// session. No backend, nothing persisted beyond the tab.

import { CONDITIONS } from "../data/conditions.js";
import { GROUPS } from "../data/groups.js";

function nameOf(row) {
  if (row.status === "unfamiliar") return "Image not recognised";
  if (row.kind && row.kind !== "spot_growth") return GROUPS[row.kind]?.name ?? row.kind;
  if (row.status === "unsure") return "Not confident — see a doctor";
  return CONDITIONS[row.predicted]?.name ?? row.predicted ?? "—";
}

const KEY = "medai.demo.history";

const SEEDED = [
  {
    id: "demo-seed-01",
    predicted: "nv",
    confidence: 0.74,
    createdAt: "2026-10-09T09:12:00.000Z",
    region: "Left forearm",
    seeded: true,
  },
  {
    id: "demo-seed-02",
    predicted: "bkl",
    confidence: 0.68,
    createdAt: "2026-10-04T16:40:00.000Z",
    region: "Upper back",
    seeded: true,
  },
  {
    id: "demo-seed-03",
    predicted: "akiec",
    confidence: 0.61,
    createdAt: "2026-09-27T11:05:00.000Z",
    region: "Right temple",
    seeded: true,
  },
];

export function readHistory() {
  let session = [];
  try {
    session = JSON.parse(sessionStorage.getItem(KEY) ?? "[]");
  } catch {
    session = [];
  }
  return [...session, ...SEEDED].map((row) => ({
    ...row,
    name: nameOf(row),
    triage:
      row.status === "answer" || !row.status
        ? (row.kind && row.kind !== "spot_growth"
            ? GROUPS[row.kind]?.triage
            : CONDITIONS[row.predicted]?.triage) ?? "routine"
        : "prompt",
  }));
}

export function saveScan(result) {
  try {
    const session = JSON.parse(sessionStorage.getItem(KEY) ?? "[]");
    const row = {
      id: result.id,
      predicted: result.predicted,
      confidence: result.confidence,
      status: result.status,
      kind: result.kind?.top ?? null,
      createdAt: result.createdAt,
      region: "This session",
      simulated: result.simulated !== false,
      seeded: false,
    };
    sessionStorage.setItem(
      KEY,
      JSON.stringify([row, ...session.filter((r) => r.id !== row.id)])
    );
    sessionStorage.setItem(`${KEY}.${result.id}`, JSON.stringify(result));
  } catch {
    /* storage unavailable — demo still works, history just won't persist */
  }
}

export function readScan(id) {
  try {
    const raw = sessionStorage.getItem(`${KEY}.${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
