import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
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
        <AnalysingState stageIndex={stageIndex} imageUrl={imageUrl} live={Boolean(serverUrl)} />
      </Layout>
    );
  }

  const status = {
    ok: ["bg-accent", "Connected to the trained model"],
    checking: ["bg-muted", "Checking the model server…"],
    down: ["bg-urgent", "Model server not reachable"],
    none: ["bg-prompt", "Simulation — no model server"],
  }[serverState];

  return (
    <Layout>
      <h1 className="text-3xl font-bold tracking-tight">Check a skin spot</h1>
      <p className="mt-2 text-base text-muted">One photo of one spot. Results in a few seconds.</p>

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
        className={`mt-6 rounded-2xl border-2 border-dashed p-6 transition-colors sm:p-10 ${
          dragging ? "border-accent bg-accent-wash" : "border-line bg-surface"
        }`}
      >
        {imageUrl ? (
          <div className="flex flex-wrap items-center gap-5">
            <img src={imageUrl} alt="Selected spot" className="size-28 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{file.name}</p>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-2 text-sm font-medium text-accent-dark hover:underline"
              >
                Choose a different photo
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-3 text-center"
          >
            <span className="flex size-14 items-center justify-center rounded-full bg-accent-wash text-accent-dark">
              <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M4 8h3l2-3h6l2 3h3v11H4z" strokeLinejoin="round" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
            </span>
            <span className="text-base font-medium">Choose a photo</span>
            <span className="text-sm text-muted">or drag it here</span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => accept(e.target.files?.[0])}
        />
      </div>

      <ul className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-muted sm:gap-3 sm:text-sm">
        {["Good light", "Spot fills the frame", "Sharp, no glare"].map((tip) => (
          <li key={tip} className="flex items-center justify-center gap-1.5 rounded-lg bg-surface px-2 py-2.5">
            <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {tip}
          </li>
        ))}
      </ul>

      {error && (
        <p className="mt-4 rounded-md border border-urgent/30 bg-urgent-wash px-3 py-2 text-sm text-urgent">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={!file}
        onClick={analyse}
        className="mt-6 flex min-h-12 w-full items-center justify-center rounded-lg bg-accent px-6 text-base font-medium text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:bg-line disabled:text-muted sm:w-auto"
      >
        Analyse photo
      </button>

      <details className="group mt-10 border-t border-line pt-4">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm text-muted [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true" className={`size-2 rounded-full ${status[0]}`} />
          {status[1]}
          <span className="ms-auto text-xs underline">Settings</span>
        </summary>
        <form
          className="mt-2 flex flex-wrap gap-2"
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
            placeholder="http://127.0.0.1:7860"
            className="min-h-11 min-w-0 flex-1 rounded-md border border-line bg-surface px-3 font-mono text-sm"
            aria-label="Model server address"
          />
          <button
            type="submit"
            className="min-h-11 rounded-md border border-line bg-surface px-4 text-sm font-medium transition-colors hover:bg-ground"
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
        {!serverUrl && (
          <label className="mt-3 flex min-h-11 items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={forceLow}
              onChange={(e) => setForceLow(e.target.checked)}
              className="size-4 accent-[#0e7c7b]"
            />
            Simulation: force a low-confidence result
          </label>
        )}
      </details>
    </Layout>
  );
}
