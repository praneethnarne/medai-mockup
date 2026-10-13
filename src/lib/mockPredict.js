// SIMULATED INFERENCE — there is no model behind this.
//
// This module is the single seam between the UI and inference. When the real
// backend exists, replace runPrediction() with a fetch to POST /predict; the
// returned shape is already the contract the backend will honour.
//
// Confidence values are deliberately held in the 0.55-0.80 band, which is the
// range the trained models in this project actually produce on HAM10000. We do
// not invent flattering numbers.

import { CLASS_ORDER, CONDITIONS } from "../data/conditions.js";

export const IS_SIMULATED = true;
export const LOW_CONFIDENCE_THRESHOLD = 0.6;

// Stable hash so the same file always yields the same demo result.
function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function mulberry32(seed) {
  let a = seed;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildProbabilities(predicted, confidence, rand) {
  const others = CLASS_ORDER.filter((c) => c !== predicted);
  const weights = others.map(() => rand() + 0.08);
  const total = weights.reduce((a, b) => a + b, 0);
  const remaining = 1 - confidence;

  const probs = { [predicted]: confidence };
  others.forEach((cls, i) => {
    probs[cls] = (weights[i] / total) * remaining;
  });
  return probs;
}

/**
 * @param {File} file
 * @param {{ forceLowConfidence?: boolean }} [options]
 * @returns {Promise<object>} same shape the real POST /predict will return
 */
export function runPrediction(file, options = {}) {
  const seed = hashString(`${file.name}:${file.size}`);
  const rand = mulberry32(seed);

  const predicted = CLASS_ORDER[seed % CLASS_ORDER.length];
  const confidence = options.forceLowConfidence
    ? 0.41 + rand() * 0.15
    : 0.55 + rand() * 0.25;

  return Promise.resolve({
    simulated: IS_SIMULATED,
    id: `demo-${seed.toString(36).slice(0, 7)}`,
    predicted,
    name: CONDITIONS[predicted].name,
    confidence,
    lowConfidence: confidence < LOW_CONFIDENCE_THRESHOLD,
    probabilities: buildProbabilities(predicted, confidence, rand),
    model: "efficientnet_b0",
    inferenceMs: Math.round(120 + rand() * 90),
    // Drives the illustrative Grad-CAM stand-in: focus point and spread, in %.
    focus: {
      x: 34 + rand() * 32,
      y: 32 + rand() * 32,
      spread: 26 + rand() * 16,
    },
    createdAt: new Date().toISOString(),
  });
}

export const PIPELINE_STAGES = [
  { key: "preprocess", label: "Resizing and normalising image", ms: 500 },
  { key: "classify", label: "Running classifier", ms: 900 },
  { key: "explain", label: "Computing Grad-CAM explanation", ms: 800 },
  { key: "guidance", label: "Matching care guidance", ms: 400 },
];
