import { useEffect, useState } from "react";
import { getServerUrl } from "./predict.js";

// The configured model server, kept in sync when it is changed on the scan page.
export default function useServerUrl() {
  const [url, setUrl] = useState(getServerUrl());
  useEffect(() => {
    const update = () => setUrl(getServerUrl());
    window.addEventListener("medai-api-changed", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("medai-api-changed", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return url;
}
