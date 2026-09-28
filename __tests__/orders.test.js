jest.mock("../server/db", () => ({
  query: jest.fn()
}));

const request = require("supertest");
const db = require("../server/db");
const app = require("../server/app");

describe("order and active delivery endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/orders/active/estates", () => {
    it("returns active estates with the contracted response shape", async () => {
      db.query.mockResolvedValueOnce([[{ estate: "Kasarani" }], []]);

      const response = await request(app).get("/api/orders/active/estates");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ estate: "Kasarani" }]);
      expect(typeof response.body[0].estate).toBe("string");
    });

    it("returns an empty array when there are no active estates", async () => {
      db.query.mockResolvedValueOnce([[], []]);

      const response = await request(app).get("/api/orders/active/estates");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /api/orders/active/schedules", () => {
    it("returns active schedules with estate and delivery time", async () => {
      db.query.mockResolvedValueOnce([[
        { estate: "Kasarani", deliveryTime: "14:00" }
      ], []]);

      const response = await request(app).get("/api/orders/active/schedules");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { estate: "Kasarani", deliveryTime: "14:00" }
      ]);
      expect(typeof response.body[0].estate).toBe("string");
      expect(typeof response.body[0].deliveryTime).toBe("string");
    });

    it("returns an empty array when there are no active schedules", async () => {
      db.query.mockResolvedValueOnce([[], []]);

      const response = await request(app).get("/api/orders/active/schedules");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("POST /api/orders", () => {
    const orderInput = {
      customerId: 12,
      vendorId: null,
      estate: "Kasarani",
      volume: 100,
      deliveryTime: "Afternoon (12pm - 6pm)",
      totalAmount: 50,
      paymentMethod: "cash"
    };

    it("creates an order and returns the persisted order fields", async () => {
      const createdOrder = {
        id: 41,
        customer_id: 12,
        vendor_id: null,
        estate: "Kasarani",
        volume: 100,
        delivery_time: "Afternoon (12pm - 6pm)",
        total_amount: 50,
        payment_method: "cash",
        status: "pending"
      };
      db.query
        .mockResolvedValueOnce([{ insertId: 41 }, []])
        .mockResolvedValueOnce([[createdOrder], []]);

      const response = await request(app)
        .post("/api/orders")
        .send(orderInput);

      expect(response.status).toBe(201);
      expect(response.body.order).toEqual(createdOrder);
      expect(response.body.order.id).toBe(41);
      expect(response.body.order.status).toBe("pending");
    });

    it("rejects a request with missing required fields", async () => {
      const response = await request(app)
        .post("/api/orders")
        .send({ estate: "Kasarani" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("All fields are required");
      expect(db.query).not.toHaveBeenCalled();
    });

    it("rejects a zero-volume order at the minimum boundary", async () => {
      const response = await request(app)
        .post("/api/orders")
        .send({ ...orderInput, volume: 0 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Volume must be greater than 0");
      expect(db.query).not.toHaveBeenCalled();
    });
  });
});