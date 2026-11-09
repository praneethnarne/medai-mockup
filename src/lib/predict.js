// The seam between the interface and inference.
//
// With a model server configured, runPrediction() sends the photo to the real MEdAI
// model (the Gradio app in praneethnarne/medai, endpoint /predict_json) and returns
// what it measured. With no server configured it falls back to the simulation in
// mockPredict.js, and every screen says so.
//
// The server address is set on the scan page, or with ?api=<url> on any page; it is
// remembered in this browser only.

import { Client } from "@gradio/client";
import { runPrediction as runSimulated } from "./mockPredict.js";

const KEY = "medai.api";

function clean(url) {
  const u = (url ?? "").trim();
  if (!u) return "";
  const bare = u.replace(/\/+$/, "");
  if (/^https?:\/\//i.test(bare)) return bare;
  return /^(localhost|127\.|0\.0\.0\.0|192\.168\.|10\.)/.test(bare) ? `http://${bare}` : `https://${bare}`;
}

// ?api=... in the address bar wins, then what was saved, then the build-time default.
export function getServerUrl() {
  try {
    const fromQuery = new URLSearchParams(window.location.search).get("api");
    if (fromQuery) {
      localStorage.setItem(KEY, clean(fromQuery));
      return clean(fromQuery);
    }
    const saved = localStorage.getItem(KEY);
    if (saved) return saved;
  } catch {
    // storage unavailable (private window): fall through
  }
  return clean(import.meta.env.VITE_MEDAI_API ?? "");
}

export function setServerUrl(url) {
  try {
    if (url) localStorage.setItem(KEY, clean(url));
    else localStorage.removeItem(KEY);
  } catch {
    // ignore: the value still applies for this page
  }
  window.dispatchEvent(new Event("medai-api-changed"));
}

export function isLive() {
  return Boolean(getServerUrl());
}

let cached = { url: null, client: null };

async function client(url) {
  if (cached.url !== url || !cached.client) {
    cached = { url, client: await Client.connect(url) };
  }
  return cached.client;
}

/** Resolves true if the server answers and exposes /predict_json. */
export async function checkServer(url = getServerUrl()) {
  if (!url) return false;
  try {
    const c = await client(url);
    const api = await c.view_api();
    return Boolean(api?.named_endpoints?.["/predict_json"]);
  } catch {
    cached = { url: null, client: null };
    return false;
  }
}

/**
 * @param {File} file
 * @param {{ forceLowConfidence?: boolean }} [options]  simulation only
 */
export async function runPrediction(file, options = {}) {
  const url = getServerUrl();
  if (!url) {
    const sim = await runSimulated(file, options);
    return { ...sim, status: sim.lowConfidence ? "unsure" : "answer", threshold: 0.6 };
  }
  const c = await client(url);
  const res = await c.predict("/predict_json", [file]);
  const data = res?.data?.[0];
  if (!data || data.error) throw new Error(data?.error ?? "The model server returned nothing.");
  return { ...data, createdAt: new Date().toISOString(), server: url };
}
