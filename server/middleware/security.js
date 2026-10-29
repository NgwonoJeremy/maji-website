
// API_KEYS="skillsbridge:abc123,maji-team:def456"  ->  Map { "abc123" => "skillsbridge", ... }
function loadKeys() {
  const keys = new Map();
  (process.env.API_KEYS || "").split(",").forEach((pair) => {
    const [name, key] = pair.split(":").map((part) => part && part.trim());
    if (name && key) keys.set(key, name);
  });
  return keys;
}

// 401 if the X-API-Key header is missing or does not match a known key.
function requireApiKey(req, res, next) {
  const key = req.get("X-API-Key");
  const consumer = key ? loadKeys().get(key) : undefined;

  if (!consumer) {
    return res.status(401).json({ error: "Missing or invalid API key" });
  }

  req.consumer = consumer;   // who is calling; used by the rate limiter
  next();
}

// Allows `max` requests per consumer in every `windowMs`. In memory, so it resets on restart.
function rateLimit({ windowMs, max }) {
  const hits = new Map();    // consumer -> { count, resetAt }

  return (req, res, next) => {
    const id = req.consumer || req.ip;
    const now = Date.now();
    let entry = hits.get(id);

    if (!entry || now >= entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(id, entry);
    }

    entry.count += 1;

    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.set("Retry-After", String(retryAfter));
      return res.status(429).json({ error: "Too many requests", retryAfterSeconds: retryAfter });
    }

    next();
  };
}

module.exports = { requireApiKey, rateLimit };