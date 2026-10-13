import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import Disclaimer from "../components/Disclaimer.jsx";
import AnalysingState from "../components/AnalysingState.jsx";
import { PIPELINE_STAGES, runPrediction } from "../lib/mockPredict.js";
import { saveScan } from "../lib/history.js";

export default function Detect() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [stageIndex, setStageIndex] = useState(-1);
  const [forceLow, setForceLow] = useState(false);
  const [error, setError] = useState(null);

  function accept(next) {
    if (!next) return;
    if (!next.type.startsWith("image/")) {
      setError("That file is not an image. Choose a JPG or PNG.");
      return;
    }
    setError(null);
    setFile(next);
    setImageUrl(URL.createObjectURL(next));
  }

  async function analyse() {
    if (!file) return;
    for (let i = 0; i < PIPELINE_STAGES.length; i += 1) {
      setStageIndex(i);
      await new Promise((r) => setTimeout(r, PIPELINE_STAGES[i].ms));
    }
    const result = await runPrediction(file, { forceLowConfidence: forceLow });
    result.imageUrl = imageUrl;
    saveScan(result);
    navigate(`/result/${result.id}`, { state: { result } });
  }

  if (stageIndex >= 0) {
    return (
      <Layout>
        <AnalysingState stageIndex={stageIndex} imageUrl={imageUrl} />
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold tracking-tight">New scan</h1>
      <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted">
        Upload a close, well-lit photo of one spot on the skin — a mole, a mark or a
        patch. Magnified clinical photos work best, but any clear phone photo is fine
        for this demo.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          accept(e.dataTransfer.files?.[0]);
        }}
        className={`mt-7 rounded-xl border-2 border-dashed p-6 transition-colors sm:p-10 ${
          dragging ? "border-accent bg-accent-wash" : "border-line bg-surface"
        }`}
      >
        {imageUrl ? (
          <div className="flex flex-wrap items-center gap-5">
            <div className="size-32 overflow-hidden rounded-lg border border-line bg-ground">
              <img src={imageUrl} alt="Selected lesion" className="size-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{file.name}</p>
              <p className="mt-0.5 font-mono text-xs text-muted">
                {(file.size / 1024).toFixed(0)} KB
              </p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-3 flex min-h-11 items-center rounded-md border border-line px-3 text-sm font-medium transition-colors hover:bg-ground"
              >
                Choose a different image
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <svg
              viewBox="0 0 24 24"
              className="mx-auto mb-4 size-9 text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path
                d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mb-4 text-sm text-muted">
              Drag an image here, or choose a file
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex min-h-11 items-center rounded-md border border-line bg-surface px-4 text-sm font-medium transition-colors hover:bg-ground"
            >
              Choose image
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => accept(e.target.files?.[0])}
        />
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-urgent/30 bg-urgent-wash px-3 py-2 text-sm text-urgent">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={!file}
          onClick={analyse}
          className="flex min-h-12 items-center rounded-md bg-accent px-5 font-medium text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
        >
          Analyse image
        </button>

        <label className="flex min-h-11 items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={forceLow}
            onChange={(e) => setForceLow(e.target.checked)}
            className="size-4 accent-[#0e7c7b]"
          />
          Demo: force a low-confidence result
        </label>
      </div>

      <Disclaimer className="mt-8" />
    </Layout>
  );
}
