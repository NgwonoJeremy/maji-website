jest.mock("../server/db", () => ({
  query: jest.fn()
}));

const request = require("supertest");
const db = require("../server/db");
const app = require("../server/app");

describe("vendor endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/vendors/top-rated", () => {
    it("returns verified top-rated vendors with typed fields", async () => {
      db.query.mockResolvedValueOnce([[
        {
          vendorId: 7,
          businessName: "Maji Fresh",
          estate: "Kasarani",
          rating: "4.8",
          isVerified: 1,
          isOnline: 0,
          ownerName: "Test Owner",
          phone: "0712345678"
        }
      ], []]);

      const response = await request(app).get("/api/vendors/top-rated");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{
        vendorId: 7,
        businessName: "Maji Fresh",
        estate: "Kasarani",
        rating: 4.8,
        isVerified: true,
        isOnline: false,
        ownerName: "Test Owner",
        phone: "0712345678"
      }]);
      expect(typeof response.body[0].rating).toBe("number");
      expect(response.body[0].rating).toBeGreaterThanOrEqual(3);
      expect(response.body[0].rating).toBeLessThanOrEqual(5);
    });

    it("returns an empty array when no vendors qualify", async () => {
      db.query.mockResolvedValueOnce([[], []]);

      const response = await request(app).get("/api/vendors/top-rated");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("GET /api/vendors/locations", () => {
    it("returns vendor locations with the contracted fields", async () => {
      db.query.mockResolvedValueOnce([[
        { vendorId: 7, businessName: "Maji Fresh", estate: "Kasarani" }
      ], []]);

      const response = await request(app).get("/api/vendors/locations");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { vendorId: 7, businessName: "Maji Fresh", estate: "Kasarani" }
      ]);
      expect(typeof response.body[0].vendorId).toBe("number");
      expect(typeof response.body[0].businessName).toBe("string");
      expect(typeof response.body[0].estate).toBe("string");
    });

    it("returns an empty array when no vendors exist", async () => {
      db.query.mockResolvedValueOnce([[], []]);

      const response = await request(app).get("/api/vendors/locations");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("PUT /api/vendors/:id", () => {
    const vendorInput = {
      businessName: "Updated Water Co.",
      dailyCapacity: 1000,
      estatesServed: "Kasarani, Roysambu",
      estate: "Kasarani",
      isOnline: false
    };

    it("updates a vendor and returns the response contract", async () => {
      const updatedVendor = {
        vendorId: 7,
        businessName: "Updated Water Co.",
        dailyCapacity: 1000,
        estatesServed: "Kasarani, Roysambu",
        estate: "Kasarani",
        isOnline: 0
      };
      db.query
        .mockResolvedValueOnce([[{ id: 7 }], []])
        .mockResolvedValueOnce([{ affectedRows: 1 }, []])
        .mockResolvedValueOnce([[updatedVendor], []]);

      const response = await request(app)
        .put("/api/vendors/7")
        .send(vendorInput);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedVendor);
      expect(response.body.vendorId).toBe(7);
      expect(response.body.businessName).toBe("Updated Water Co.");
      expect(response.body.estate).toBe("Kasarani");
    });

    it("rejects missing business name or estate", async () => {
      const response = await request(app)
        .put("/api/vendors/7")
        .send({ businessName: "Updated Water Co." });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Business name and estate are required");
      expect(db.query).not.toHaveBeenCalled();
    });

    it("rejects vendor fields with the wrong type", async () => {
      const response = await request(app)
        .put("/api/vendors/7")
        .send({ ...vendorInput, isOnline: "false" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Vendor fields must have valid types");
      expect(db.query).not.toHaveBeenCalled();
    });

    it("returns 404 when the vendor does not exist", async () => {
      db.query.mockResolvedValueOnce([[], []]);

      const response = await request(app)
        .put("/api/vendors/999999")
        .send(vendorInput);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Vendor not found");
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it("rejects a non-numeric vendor ID", async () => {
      const response = await request(app)
        .put("/api/vendors/not-an-id")
        .send(vendorInput);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Vendor ID must be a positive integer");
      expect(db.query).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /api/vendors/:id", () => {
    it("deletes an existing vendor and returns an empty 204 response", async () => {
      db.query
        .mockResolvedValueOnce([[{ id: 7 }], []])
        .mockResolvedValueOnce([{ affectedRows: 1 }, []]);

      const response = await request(app).delete("/api/vendors/7");

      expect(response.status).toBe(204);
      expect(response.text).toBe("");
      expect(db.query).toHaveBeenCalledTimes(2);
    });

    it("returns 404 when the vendor does not exist", async () => {
      db.query.mockResolvedValueOnce([[], []]);

      const response = await request(app).delete("/api/vendors/999999");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Vendor not found");
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it("rejects a non-numeric vendor ID", async () => {
      const response = await request(app).delete("/api/vendors/not-an-id");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Vendor ID must be a positive integer");
      expect(db.query).not.toHaveBeenCalled();
    });
  });
});