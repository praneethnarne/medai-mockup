import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import Disclaimer from "../components/Disclaimer.jsx";
import AnalysingState from "../components/AnalysingState.jsx";
import { PIPELINE_STAGES } from "../lib/mockPredict.js";
import { checkServer, runPrediction, setServerUrl } from "../lib/predict.js";
import useServerUrl from "../lib/useLive.js";
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
  const serverUrl = useServerUrl();
  const [draftUrl, setDraftUrl] = useState(serverUrl);
  const [serverState, setServerState] = useState(serverUrl ? "checking" : "none");

  useEffect(() => {
    let alive = true;
    if (!serverUrl) {
      setServerState("none");
      return undefined;
    }
    setServerState("checking");
    checkServer(serverUrl).then((ok) => alive && setServerState(ok ? "ok" : "down"));
    return () => {
      alive = false;
    };
  }, [serverUrl]);

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
    setError(null);
    // The real request runs while the stages play; the last stage waits for it.
    const request = runPrediction(file, { forceLowConfidence: forceLow });
    request.catch(() => {});
    for (let i = 0; i < PIPELINE_STAGES.length; i += 1) {
      setStageIndex(i);
      await new Promise((r) => setTimeout(r, serverUrl ? 350 : PIPELINE_STAGES[i].ms));
    }
    try {
      const result = await request;
      result.imageUrl = imageUrl;
      saveScan(result);
      navigate(`/result/${result.id}`, { state: { result } });
    } catch (e) {
      setStageIndex(-1);
      setError(
        `The model server did not answer (${e?.message ?? "unknown error"}). Check the ` +
          "server address below, or clear it to use the simulation.",
      );
    }
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

        {!serverUrl && (
          <label className="flex min-h-11 items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={forceLow}
              onChange={(e) => setForceLow(e.target.checked)}
              className="size-4 accent-[#0e7c7b]"
            />
            Demo: force a low-confidence result
          </label>
        )}
      </div>

      <section className="mt-8 rounded-xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold">Model server</h2>
          <span
            className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium ${
              {
                ok: "bg-accent-wash text-accent-dark",
                checking: "bg-routine-wash text-routine",
                down: "bg-urgent-wash text-urgent",
                none: "bg-prompt-wash text-prompt",
              }[serverState]
            }`}
          >
            {
              {
                ok: "CONNECTED — real model",
                checking: "CHECKING…",
                down: "NOT REACHABLE",
                none: "NONE — simulated results",
              }[serverState]
            }
          </span>
        </div>
        <p className="mt-1.5 max-w-prose text-xs leading-relaxed text-muted">
          Paste the address the MEdAI notebook prints (a <span className="font-mono">gradio.live</span>{" "}
          link), or <span className="font-mono">http://127.0.0.1:7860</span> when the model runs on
          this computer. Leave it empty to use simulated results.
        </p>
        <form
          className="mt-3 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setServerUrl(draftUrl);
          }}
        >
          <input
            type="text"
            inputMode="url"
            autoCapitalize="off"
            spellCheck={false}
            value={draftUrl}
            onChange={(e) => setDraftUrl(e.target.value)}
            placeholder="https://xxxx.gradio.live"
            className="min-h-11 min-w-0 flex-1 rounded-md border border-line bg-ground px-3 font-mono text-sm"
            aria-label="Model server address"
          />
          <button
            type="submit"
            className="min-h-11 rounded-md border border-line px-4 text-sm font-medium transition-colors hover:bg-ground"
          >
            Connect
          </button>
          {serverUrl && (
            <button
              type="button"
              onClick={() => {
                setDraftUrl("");
                setServerUrl("");
              }}
              className="min-h-11 rounded-md px-3 text-sm text-muted underline"
            >
              Use simulation
            </button>
          )}
        </form>
      </section>

      <Disclaimer className="mt-8" />
    </Layout>
  );
}
