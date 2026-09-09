import { useState, useEffect } from "react";

async function load(url, signal, setData, setError, setLoading) {
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error("Could not load the menu");
    const json = await res.json();
    setData(json);
  } catch (e) {
    if (e.name !== "AbortError") setError(e.message);
  } finally {
    setLoading(false);
  }
}

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    load(url, ctrl.signal, setData, setError, setLoading);
    return () => ctrl.abort();
  }, [url]);

  return { data, loading, error };
}