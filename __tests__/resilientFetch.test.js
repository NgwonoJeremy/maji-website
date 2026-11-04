const { fetchWithRetry } = require("../server/resilientFetch");

// A minimal stand-in for fetch's Response.
const reply = (status, headers = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: { get: (name) => headers[name] ?? null }
});

const fast = { timeoutMs: 1500, retries: 2, delayMs: 1 }; // short waits so tests stay quick

describe("fetchWithRetry", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    console.warn.mockRestore();
  });

  it("returns a good answer straight away", async () => {
    global.fetch.mockResolvedValueOnce(reply(200));

    const res = await fetchWithRetry("http://partner.test/tasks", {}, fast);

    expect(res.status).toBe(200);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("gives every attempt a timeout signal", async () => {
    global.fetch.mockResolvedValueOnce(reply(200));

    await fetchWithRetry("http://partner.test/tasks", { headers: { a: "b" } }, fast);

    const options = global.fetch.mock.calls[0][1];
    expect(options.signal).toBeInstanceOf(AbortSignal);
    expect(options.headers).toEqual({ a: "b" });
  });

  it("retries a 503 and returns the answer that finally works", async () => {
    global.fetch
      .mockResolvedValueOnce(reply(503))
      .mockResolvedValueOnce(reply(503))
      .mockResolvedValueOnce(reply(200));

    const res = await fetchWithRetry("http://partner.test/tasks", {}, fast);

    expect(res.status).toBe(200);
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it("stops after 2 retries and returns the last failure", async () => {
    global.fetch.mockResolvedValue(reply(500));

    const res = await fetchWithRetry("http://partner.test/tasks", {}, fast);

    expect(res.status).toBe(500);
    expect(global.fetch).toHaveBeenCalledTimes(3); // never an endless loop
  });

  it("retries a dropped connection, then throws when retries run out", async () => {
    global.fetch.mockRejectedValue(new Error("connect ECONNREFUSED"));

    await expect(fetchWithRetry("http://partner.test/tasks", {}, fast)).rejects.toThrow("ECONNREFUSED");
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it.each([400, 401, 403, 404])("does not retry a %i", async (status) => {
    global.fetch.mockResolvedValue(reply(status));

    const res = await fetchWithRetry("http://partner.test/tasks", {}, fast);

    expect(res.status).toBe(status);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it.each(["POST", "PUT", "PATCH", "DELETE"])("never retries a %s, because it changes data", async (method) => {
    global.fetch.mockResolvedValue(reply(503));

    const res = await fetchWithRetry("http://partner.test/orders", { method }, fast);

    expect(res.status).toBe(503);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("waits as long as Retry-After asks after a 429", async () => {
    global.fetch
      .mockResolvedValueOnce(reply(429, { "Retry-After": "1" }))
      .mockResolvedValueOnce(reply(200));

    const started = Date.now();
    const res = await fetchWithRetry("http://partner.test/tasks", {}, fast);

    expect(res.status).toBe(200);
    expect(Date.now() - started).toBeGreaterThanOrEqual(900); // about 1 second, not the 1 ms delay
  });

  it("really times out a partner that never answers", async () => {
    global.fetch.mockImplementation((url, options) =>
      new Promise((resolve, reject) => {
        options.signal.addEventListener("abort", () => reject(options.signal.reason));
      })
    );

    const started = Date.now();
    await expect(
      fetchWithRetry("http://partner.test/tasks", {}, { timeoutMs: 50, retries: 0, delayMs: 1 })
    ).rejects.toMatchObject({ name: "TimeoutError" });
    expect(Date.now() - started).toBeLessThan(1000);
  });
});
