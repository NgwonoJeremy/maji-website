// Sends a mix of good and bad requests to Maji so /api/stats has something to show.
// Usage: MAJI_URL=http://localhost:3001 API_KEY=<your key> node scripts/traffic.js
const base = process.env.MAJI_URL || "http://localhost:3001";
const key = process.env.API_KEY;
if (!key) { console.error("Set API_KEY first (do not paste it into code)."); process.exit(1); }

const calls = [
  ["/api/orders/active/estates", key, 20],
  ["/api/orders/active/schedules", key, 10],
  ["/api/vendors/top-rated", key, 10],
  ["/api/orders/active/estates", "wrong-key", 5],   // 401s
  ["/api/does-not-exist", key, 3],                  // 404s
];

(async () => {
  for (const [path, k, n] of calls) {
    for (let i = 0; i < n; i++) await fetch(base + path, { headers: { "X-API-Key": k } }).catch(() => {});
  }
  const res = await fetch(base + "/api/stats", { headers: { "X-API-Key": key } });
  console.log(JSON.stringify(await res.json(), null, 2));
})();
