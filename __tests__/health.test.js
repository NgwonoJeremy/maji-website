process.env.SAFEMEDS_URL = "http://safemeds.test";
process.env.SAFEMEDS_API_KEY = "sm-test-key";
process.env.SAFEMEDS_RETRY_DELAY_MS = "1"; // keep the retry waits short in tests

jest.mock("../server/db", () => ({
  query: jest.fn()
}));

const request = require("supertest");
const db = require("../server/db");
const app = require("../server/app");
const healthRouter = require("../server/routes/health");

// A minimal stand-in for fetch's Response.
const reply = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body
});

describe("Health Journal routes (SafeMeds Service 2)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    healthRouter.clearSaved(); // start every case with nothing saved
    global.fetch = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe("GET /api/health/stock", () => {
    it("calls /inventory?available=true with the key and returns the contracted fields", async () => {
      global.fetch.mockResolvedValueOnce(reply(200, [
        { productId: 8, productName: "Chlorine", availableQuantity: 300, isAvailable: true, extra: "x" }
      ]));

      const response = await request(app).get("/api/health/stock");

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ stale: false });
      expect(response.body.data).toEqual([
        { productId: 8, productName: "Chlorine", availableQuantity: 300, isAvailable: true }
      ]);
      expect(global.fetch.mock.calls[0][0]).toBe("http://safemeds.test/inventory?available=true");
      expect(global.fetch.mock.calls[0][1].headers["X-API-Key"]).toBe("sm-test-key");
    });

    it("returns 502 when SafeMeds rejects the key", async () => {
      global.fetch.mockResolvedValueOnce(reply(401, { message: "Missing or invalid API key" }));

      const response = await request(app).get("/api/health/stock");

      expect(response.status).toBe(502);
      expect(response.body).toEqual({ message: "Partner data unavailable" });
    });
  });

  describe("GET /api/health/products", () => {
    it("maps /reviews to the fields the page shows", async () => {
      global.fetch.mockResolvedValueOnce(reply(200, [
        { productId: 19, productName: "Aquamira", averageRating: 4.8, reviewCount: 6, topComment: "Clean water" }
      ]));

      const response = await request(app).get("/api/health/products");

      expect(response.status).toBe(200);
      expect(response.body.stale).toBe(false);
      expect(response.body.data).toEqual([
        { productId: 19, productName: "Aquamira", averageRating: 4.8, reviewCount: 6, topComment: "Clean water" }
      ]);
      expect(global.fetch.mock.calls[0][0]).toBe("http://safemeds.test/reviews");
    });

    it("returns 502 when SafeMeds cannot be reached", async () => {
      global.fetch.mockRejectedValue(new Error("connect ECONNREFUSED"));

      const response = await request(app).get("/api/health/products");

      expect(response.status).toBe(502);
      expect(global.fetch).toHaveBeenCalledTimes(3); // the first try plus 2 retries
    });
  });

  describe("GET /api/health/alerts", () => {
    it("requires an estate", async () => {
      const response = await request(app).get("/api/health/alerts");

      expect(response.status).toBe(400);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("calls the v1 alerts path and maps SafeMeds' fields", async () => {
      global.fetch.mockResolvedValueOnce(reply(200, [
        {
          region: "Kasarani",
          illnessCategory: "Cholera",
          alertDate: "2026-10-28",
          prescriptionCount: 9,
          spikeRatio: 3.4,
          signalMode: "demo",
          baseline: { dailyAverage: 2.6 }
        }
      ]));

      const response = await request(app).get("/api/health/alerts?estate=Kasarani");

      expect(response.status).toBe(200);
      expect(response.body.stale).toBe(false);
      expect(response.body.data).toEqual([
        {
          alertId: "Cholera-2026-10-28",
          illnessType: "Cholera",
          detectedAt: "2026-10-28",
          prescriptionCount: 9,
          spikeRatio: 3.4,
          signalMode: "demo"
        }
      ]);
      const url = global.fetch.mock.calls[0][0];
      expect(url).toContain("http://safemeds.test/v1/health-signals/area-alerts?region=Kasarani&since=");
    });

    it("returns an empty list when SafeMeds has no alerts for the estate", async () => {
      global.fetch.mockResolvedValueOnce(reply(200, []));

      const response = await request(app).get("/api/health/alerts?estate=Kasarani");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.stale).toBe(false);
    });
  });

  describe("when SafeMeds is slow or failing (Week 11)", () => {
    const stock = [{ productId: 8, productName: "Chlorine", availableQuantity: 300, isAvailable: true }];

    it("retries a failing read and succeeds without the page noticing", async () => {
      global.fetch
        .mockResolvedValueOnce(reply(503, { message: "Try again" }))
        .mockResolvedValueOnce(reply(503, { message: "Try again" }))
        .mockResolvedValueOnce(reply(200, stock));

      const response = await request(app).get("/api/health/stock");

      expect(response.status).toBe(200);
      expect(response.body.stale).toBe(false);
      expect(response.body.data).toEqual(stock);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it("gives up after 2 retries when SafeMeds keeps failing", async () => {
      global.fetch.mockResolvedValue(reply(500, { message: "Internal error" }));

      const response = await request(app).get("/api/health/stock");

      expect(response.status).toBe(502);
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it("does not retry a 401, because asking again changes nothing", async () => {
      global.fetch.mockResolvedValue(reply(401, { message: "Missing or invalid API key" }));

      const response = await request(app).get("/api/health/stock");

      expect(response.status).toBe(502);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("serves the last saved copy, flagged stale, when SafeMeds stops answering", async () => {
      global.fetch.mockResolvedValueOnce(reply(200, stock));
      const live = await request(app).get("/api/health/stock");

      global.fetch.mockRejectedValue(new Error("connect ECONNREFUSED"));
      const saved = await request(app).get("/api/health/stock");

      expect(saved.status).toBe(200);
      expect(saved.body.stale).toBe(true);
      expect(saved.body.data).toEqual(stock);
      expect(saved.body.asOf).toBe(live.body.asOf); // the time the copy was saved, not now
    });

    it("keeps a separate saved copy for each estate's alerts", async () => {
      global.fetch.mockResolvedValueOnce(reply(200, [
        { illnessCategory: "Cholera", alertDate: "2026-10-28", prescriptionCount: 9, spikeRatio: 3, signalMode: "demo" }
      ]));
      await request(app).get("/api/health/alerts?estate=Kasarani");

      global.fetch.mockRejectedValue(new Error("connect ECONNREFUSED"));
      const kasarani = await request(app).get("/api/health/alerts?estate=Kasarani");
      const rongai = await request(app).get("/api/health/alerts?estate=Rongai");

      expect(kasarani.body.stale).toBe(true);
      expect(kasarani.body.data).toHaveLength(1);
      expect(rongai.status).toBe(502); // nothing was ever saved for Rongai
    });
  });

  describe("POST /api/health/orders", () => {
    const order = { customerId: 3, productId: 7, productName: "Aquatabs", quantity: 5 };

    it("rejects a bad quantity before calling SafeMeds", async () => {
      const response = await request(app).post("/api/health/orders").send({ ...order, quantity: 0 });

      expect(response.status).toBe(400);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("rejects a missing product name", async () => {
      const response = await request(app).post("/api/health/orders").send({ ...order, productName: "" });

      expect(response.status).toBe(400);
    });

    it("returns 404 when the customer does not exist", async () => {
      db.query.mockResolvedValueOnce([[], []]);

      const response = await request(app).post("/api/health/orders").send(order);

      expect(response.status).toBe(404);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("places the order with the name from Maji's database and saves a copy", async () => {
      db.query
        .mockResolvedValueOnce([[{ name: "Amina Otieno" }], []])
        .mockResolvedValueOnce([{ insertId: 1 }, []]);
      global.fetch.mockResolvedValueOnce(reply(201, { message: "Order placed successfully", orderId: 42, status: "Pending" }));

      const response = await request(app).post("/api/health/orders").send(order);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        orderId: 42,
        productId: 7,
        productName: "Aquatabs",
        quantity: 5,
        status: "Pending",
        recorded: true
      });

      const [url, options] = global.fetch.mock.calls[0];
      expect(url).toBe("http://safemeds.test/orders");
      expect(options.method).toBe("POST");
      expect(options.headers["X-API-Key"]).toBe("sm-test-key");
      expect(JSON.parse(options.body)).toEqual({ productId: 7, quantity: 5, customerName: "Amina Otieno" });

      expect(db.query.mock.calls[1][1]).toEqual([3, 42, 7, "Aquatabs", 5, "Pending"]);
    });

    it("passes on SafeMeds' reason when it refuses the order", async () => {
      db.query.mockResolvedValueOnce([[{ name: "Amina Otieno" }], []]);
      global.fetch.mockResolvedValueOnce(reply(400, { message: "Invalid payload. 'productId' must be a valid number." }));

      const response = await request(app).post("/api/health/orders").send(order);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("productId");
    });

    it("returns 502 when SafeMeds is down and saves nothing", async () => {
      db.query.mockResolvedValueOnce([[{ name: "Amina Otieno" }], []]);
      global.fetch.mockResolvedValueOnce(reply(500, { message: "Internal server error" }));

      const response = await request(app).post("/api/health/orders").send(order);

      expect(response.status).toBe(502);
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledTimes(1); // an order is never retried
    });

    it("tells the customer when SafeMeds times out, and never retries the order", async () => {
      db.query.mockResolvedValueOnce([[{ name: "Amina Otieno" }], []]);
      const timeout = new Error("The operation was aborted due to timeout");
      timeout.name = "TimeoutError";
      global.fetch.mockRejectedValue(timeout);

      const response = await request(app).post("/api/health/orders").send(order);

      expect(response.status).toBe(504);
      expect(response.body.message).toContain("cannot confirm your order");
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledTimes(1); // nothing saved in Maji
    });
  });

  describe("GET /api/health/orders", () => {
    it("requires a valid customerId", async () => {
      const response = await request(app).get("/api/health/orders?customerId=abc");

      expect(response.status).toBe(400);
      expect(db.query).not.toHaveBeenCalled();
    });

    it("returns the customer's saved orders", async () => {
      const rows = [{ orderId: 42, productId: 7, productName: "Aquatabs", quantity: 5, status: "Pending", createdAt: "2026-10-29T19:00:00.000Z" }];
      db.query.mockResolvedValueOnce([rows, []]);

      const response = await request(app).get("/api/health/orders?customerId=3");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(rows);
      expect(db.query.mock.calls[0][1]).toEqual([3]);
    });
  });
});
