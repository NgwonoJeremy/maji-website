jest.mock("../server/db", () => ({
  query: jest.fn()
}));

const request = require("supertest");
const db = require("../server/db");
const app = require("../server/app");

describe("customer endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("PUT /api/customers/:id", () => {
    const customerInput = {
      name: "Test Customer",
      email: "customer.test@example.com",
      phone: "0700000000",
      estate: "Kasarani"
    };

    it("updates a customer and returns the response contract", async () => {
      const updatedCustomer = {
        id: 12,
        ...customerInput,
        role: "customer"
      };
      db.query
        .mockResolvedValueOnce([[{ id: 12 }], []])
        .mockResolvedValueOnce([{ affectedRows: 1 }, []])
        .mockResolvedValueOnce([[updatedCustomer], []]);

      const response = await request(app)
        .put("/api/customers/12")
        .send(customerInput);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedCustomer);
      expect(response.body.name).toBe("Test Customer");
      expect(response.body.email).toBe("customer.test@example.com");
      expect(response.body.phone).toBe("0700000000");
      expect(response.body.estate).toBe("Kasarani");
    });

    it("rejects missing required customer fields", async () => {
      const response = await request(app)
        .put("/api/customers/12")
        .send({ name: "Test Customer" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Name, email and phone are required");
      expect(db.query).not.toHaveBeenCalled();
    });

    it("returns 404 when the customer does not exist", async () => {
      db.query.mockResolvedValueOnce([[], []]);

      const response = await request(app)
        .put("/api/customers/999999")
        .send(customerInput);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Customer not found");
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });
});