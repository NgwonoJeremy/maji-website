// traffic.js: sends a mix of requests to the Maji API, to give /stats and the log some data.
// Run (PowerShell):
//   $env:API="http://localhost:3001"; $env:KEY=$key; node traffic.js
//   $env:N="200"; node traffic.js        (more requests, to trigger the rate limit)
const API = process.env.API || "http://localhost:3001";
const KEY = process.env.KEY;
const N = Number(process.env.N || 60);

const mix = [
  // good requests with a key (the four SkillsBridge routes)
  { method: "GET", path: "/api/orders/active/estates", key: true },
  { method: "GET", path: "/api/orders/active/schedules", key: true },
  { method: "GET", path: "/api/vendors/top-rated", key: true },
  { method: "GET", path: "/api/vendors/top-rated", key: true },
  { method: "GET", path: "/api/vendors/locations", key: true },
  { method: "GET", path: "/api/vendors/locations", key: true },
  // no key at all
  { method: "GET", path: "/api/vendors/locations", key: false },
  // wrong key
  { method: "GET", path: "/api/vendors/top-rated", key: "wrong" },
  // a path that doesn't exist
  { method: "GET", path: "/api/not-a-route", key: true },
];

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  if (!KEY) {
    console.error("Set KEY first, for example: $env:KEY=$key");
    process.exit(1);
  }
  const counts = {};
  for (let i = 0; i < N; i++) {
    const r = mix[Math.floor(Math.random() * mix.length)];
    const headers = r.key === true ? { "X-API-Key": KEY } : r.key === "wrong" ? { "X-API-Key": "wrong" } : {};
    try {
      const res = await fetch(API + r.path, { method: r.method, headers });
      counts[res.status] = (counts[res.status] || 0) + 1;
    } catch (err) {
      counts.failed = (counts.failed || 0) + 1;
    }
    await pause(50);
  }
  console.log("Status codes received:", counts);
})();