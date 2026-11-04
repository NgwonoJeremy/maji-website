// Calls a partner API with a timeout and a few careful retries (Week 11).
//
// What it does:
//   - Gives up on any attempt that takes longer than `timeoutMs`.
//   - Retries only when a second try could help: a timeout, a dropped connection,
//     a 5xx answer, or a 429 (waiting as long as the partner's Retry-After asks).
//   - Never retries a 400, 401, 403 or 404: the request is wrong, so asking again changes nothing.
//   - Never retries a write (POST, PUT, PATCH, DELETE): a retry could do it twice.
//   - Stops after `retries` retries, waiting longer each time (200 ms, then 400 ms).
//
// Worst case for a GET: (retries + 1) x timeoutMs + the waits = 3 x 1500 + 200 + 400 = 5100 ms.

const RETRY_STATUSES = new Set([429, 500, 502, 503, 504]);
const MAX_RETRY_AFTER_MS = 5000; // never wait longer than this, even if the partner asks

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options = {}, config = {}) {
  const { timeoutMs = 1500, retries = 2, delayMs = 200 } = config;
  const method = (options.method || "GET").toUpperCase();
  const maxRetries = method === "GET" ? retries : 0; // never retry writes

  for (let attempt = 0; ; attempt++) {
    let wait = delayMs * 2 ** attempt; // 200 ms, then 400 ms

    try {
      const res = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(timeoutMs), // the timeout: give up on a slow attempt
      });

      // Done: a good answer, a "your request is wrong" answer, or no retries left.
      if (!RETRY_STATUSES.has(res.status) || attempt >= maxRetries) return res;

      const retryAfter = Number(res.headers?.get("Retry-After"));
      if (res.status === 429 && retryAfter > 0) {
        wait = Math.min(retryAfter * 1000, MAX_RETRY_AFTER_MS); // wait as asked, up to a limit
      }
    } catch (err) {
      if (attempt >= maxRetries) throw err; // out of retries (or a write): give up
    }

    console.warn(`attempt ${attempt + 1} failed, retrying in ${wait} ms`);
    await sleep(wait);
  }
}

module.exports = { fetchWithRetry };
