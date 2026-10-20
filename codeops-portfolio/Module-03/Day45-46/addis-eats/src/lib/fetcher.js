// The one fetcher used by every client query (SWR). It turns a failed response into an
// error, so the hook's `error` is set for 401, 403, 404 and 500 instead of treating the
// error body as data.
export async function fetcher(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("Request failed");
    error.status = res.status;
    try {
      error.info = await res.json();
    } catch {}
    throw error;
  }
  return res.json();
}
