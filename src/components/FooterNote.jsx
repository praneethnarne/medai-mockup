import useServerUrl from "../lib/useLive.js";

export default function FooterNote() {
  const url = useServerUrl();
  return url ? (
    <>
      MEdAI — final-year project, MLR Institute of Technology. Results come from the
      trained model running on the configured server. A first check, not a diagnosis.
    </>
  ) : (
    <>
      MEdAI — final-year project, MLR Institute of Technology. No model server is
      connected, so results are simulated. Set one on the scan page.
    </>
  );
}
