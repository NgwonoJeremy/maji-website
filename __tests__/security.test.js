process.env.API_KEYS = "skillsbridge:test-key-123";
jest.mock("../server/db", () => ({
  query: jest.fn()
}));
const request = require("supertest");
const db = require("../server/db");
const app = require("../server/app");
describe("API key authentication", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("returns 401 when no API key is sent", async () => {
    const response = await request(app).get("/api/orders/active/estates");
    expect(response.status).toBe(401);
    expect(db.query).not.toHaveBeenCalled();
  });
  it("returns 401 when the API key is wrong", async () => {
    const response = await request(app)
      .get("/api/orders/active/estates")
      .set("X-API-Key", "wrong-key");
    expect(response.status).toBe(401);
  });
  it("returns 200 when a valid API key is sent", async () => {
    db.query.mockResolvedValueOnce([[{ estate: "Kasarani" }], []]);
    const response = await request(app)
      .get("/api/orders/active/estates")
      .set("X-API-Key", "test-key-123");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ estate: "Kasarani" }]);
  });
})