process.env.API_KEYS = "skillsbridge:test-key-123";

jest.mock("../server/db", () => ({ query: jest.fn() }));

const request = require("supertest");
const app = require("../server/app");
const db = require("../server/db");
const { reset } = require("../server/middleware/monitoring");

const withKey = (r) => r.set("X-API-Key", "test-key-123");

describe("monitoring and /stats (Week 12)", () => {
  let logSpy;
  beforeEach(() => {
    reset();
    db.query.mockReset();
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });
  afterEach(() => logSpy.mockRestore());

  const logged = () => logSpy.mock.calls.map((c) => { try { return JSON.parse(c[0]); } catch { return null; } }).filter(Boolean);

  it("logs one JSON line per request with time, method, path, status, ms and a key-xxxxxx caller", async () => {
    db.query.mockResolvedValue([[{ estate: "Kilimani" }]]);
    await withKey(request(app).get("/api/orders/active/estates"));
    const line = logged().find((l) => l.path === "/api/orders/active/estates");
    expect(Object.keys(line)).toEqual(["time", "method", "path", "status", "ms", "caller"]);
    expect(line).toMatchObject({ method: "GET", status: 200 });
    expect(typeof line.ms).toBe("number");
    expect(line.caller).toMatch(/^key-[0-9a-f]{6}$/);
  });

  it("labels wrong and missing keys as none", async () => {
    await request(app).get("/api/orders/active/estates").set("X-API-Key", "wrong");
    await request(app).get("/api/orders/active/estates");
    const lines = logged();
    expect(lines).toHaveLength(2);
    lines.forEach((l) => expect(l).toMatchObject({ status: 401, caller: "none" }));
  });

  it("never logs the API key, the caller name or the query string", async () => {
    db.query.mockResolvedValue([[]]);
    await withKey(request(app).get("/api/orders/active/estates?secret=hunter2"));
    const text = JSON.stringify(logged());
    expect(text).not.toContain("test-key-123");
    expect(text).not.toContain("skillsbridge");
    expect(text).not.toContain("hunter2");
  });

  it("logs rejected requests too (401)", async () => {
    await request(app).get("/api/orders/active/estates");
    expect(logged().some((l) => l.status === 401)).toBe(true);
  });

  it("requires an API key for /stats", async () => {
    expect((await request(app).get("/stats")).status).toBe(401);
    expect((await request(app).get("/api/stats")).status).toBe(401);
  });

  it("reports counts, errors, error rate and timings per route", async () => {
    db.query.mockResolvedValueOnce([[{ estate: "A" }]]);
    await withKey(request(app).get("/api/orders/active/estates"));
    db.query.mockRejectedValueOnce(new Error("db down"));
    jest.spyOn(console, "error").mockImplementation(() => {});
    await withKey(request(app).get("/api/orders/active/estates"));
    await request(app).get("/api/orders/active/estates"); // 401

    const res = await withKey(request(app).get("/stats"));
    expect(res.status).toBe(200);
    const r = res.body.routes["GET /api/orders/active/estates"];
    expect(r.count).toBe(3);
    expect(r.serverErrors).toBe(1);
    expect(r.clientErrors).toBe(1);
    expect(r.avgMs).toBeGreaterThanOrEqual(0);
    expect(r.maxMs).toBeGreaterThanOrEqual(r.avgMs);
    expect(res.body.total).toBe(3);
    expect(res.body.clientErrors).toBe(1);
    expect(res.body.serverErrors).toBe(1);
    expect(res.body.errorRatePercent).toBeCloseTo(33.3, 1); // 5xx only: 1 of 3
    expect(res.body.avgMs).toBeGreaterThanOrEqual(0);
    expect(typeof res.body.startedAt).toBe("string");
    expect(typeof res.body.uptimeSeconds).toBe("number");
  });

  it("groups by route pattern, not by the real URL", async () => {
    db.query.mockResolvedValue([[]]);
    await request(app).get("/no/such/page");
    const res = await withKey(request(app).get("/stats"));
    expect(Object.keys(res.body.routes)).toContain("GET (no route)");
    expect(JSON.stringify(res.body)).not.toContain("/no/such/page");
  });
});
