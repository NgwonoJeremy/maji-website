process.env.API_KEYS = "skillbridge:test-key";

jest.mock("../server/db", () => ({
  query: jest.fn(async (sql) => {
    if (/DISTINCT\s+estate\s+FROM orders/i.test(sql) && !/delivery_time/i.test(sql)) {
      return [[{ estate: "Kasarani" }, { estate: "Roysambu" }], []];
    }
    if (/delivery_time/i.test(sql)) {
      return [[{ estate: "Kasarani", deliveryTime: "08:00" }], []];
    }
    return [[], []];
  }),
}));

const request = require("supertest");
const app = require("../server/app");

const KEY = { "X-API-Key": "test-key" };
const V1_ESTATES = "/api/v1/orders/active/estates";
const OLD_ESTATES = "/api/orders/active/estates";
const V2_ESTATES = "/api/v2/orders/active/estates";

describe("v1 is frozen", () => {
  test("GET /api/v1/orders/active/estates keeps its original shape", async () => {
    const res = await request(app).get(V1_ESTATES).set(KEY);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(Object.keys(res.body[0]).sort()).toEqual(["estate"]);
  });

  test("old unversioned /api/orders/active/estates still answers the same way", async () => {
    const a = await request(app).get(OLD_ESTATES).set(KEY);
    const b = await request(app).get(V1_ESTATES).set(KEY);
    expect(a.status).toBe(200);
    expect(a.body).toEqual(b.body);
    expect(a.body).toEqual([{ estate: "Kasarani" }, { estate: "Roysambu" }]);
  });

  test("v1 still needs a key", async () => {
    const res = await request(app).get(OLD_ESTATES);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Missing or invalid API key" });
  });
});

describe("v2 has the new shape", () => {
  test("list is wrapped in { data, count }", async () => {
    const res = await request(app).get(V2_ESTATES).set(KEY);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: [{ estate: "Kasarani" }, { estate: "Roysambu" }],
      count: 2,
    });
  });

  test("v2 needs an API key like everything else", async () => {
    const res = await request(app).get(V2_ESTATES);
    expect(res.status).toBe(401);
  });

  test("endpoints that did not change answer the same on v2 as on v1", async () => {
    const a = await request(app).get("/api/v1/orders/active/schedules").set(KEY);
    const b = await request(app).get("/api/v2/orders/active/schedules").set(KEY);
    expect(b.status).toBe(200);
    expect(b.body).toEqual(a.body);
  });
});

describe("deprecation headers", () => {
  test("v1 and the old URL announce the sunset", async () => {
    for (const path of [V1_ESTATES, OLD_ESTATES]) {
      const res = await request(app).get(path).set(KEY);
      expect(res.headers.deprecation).toBe("true");
      expect(res.headers.sunset).toBe("Fri, 13 Nov 2026 00:00:00 GMT");
      expect(res.headers.link).toContain('rel="successor-version"');
      expect(res.headers.link).toContain(V2_ESTATES);
    }
  });

  test("v2 and unchanged endpoints do not carry them", async () => {
    for (const path of [V2_ESTATES, "/api/orders/active/schedules"]) {
      const res = await request(app).get(path).set(KEY);
      expect(res.headers.deprecation).toBeUndefined();
    }
  });

  test("a request with no key gets no deprecation headers", async () => {
    const res = await request(app).get(OLD_ESTATES);
    expect(res.headers.deprecation).toBeUndefined();
  });
});