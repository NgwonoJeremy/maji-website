process.env.SAFEMEDS_URL = "http://safemeds.test";
process.env.SAFEMEDS_API_KEY = "sm-test-key";

jest.mock("../server/db", () => ({
  query: jest.fn()
}));

const request = require("supertest");
const db = require("../server/db");
const app = require("../server/app");

// A minimal stand-in for fetch's Response.
const reply = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body
});

describe("Health Journal routes (SafeMeds Service 2)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      expect(response.body).toEqual([
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
      expect(response.body).toEqual([
        { productId: 19, productName: "Aquamira", averageRating: 4.8, reviewCount: 6, topComment: "Clean water" }
      ]);
      expect(global.fetch.mock.calls[0][0]).toBe("http://safemeds.test/reviews");
    });

    it("returns 502 when SafeMeds cannot be reached", async () => {
      global.fetch.mockRejectedValueOnce(new Error("connect ECONNREFUSED"));

      const response = await request(app).get("/api/health/products");

      expect(response.status).toBe(502);
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
      expect(response.body).toEqual([
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
      expect(response.body).toEqual([]);
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
