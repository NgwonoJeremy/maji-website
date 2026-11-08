process.env.JWT_SECRET="test-secret";
jest.mock("../server/db", () => ({ query: jest.fn() })); 

const request = require("supertest");                        
const db = require("../server/db");
const app = require("../server/app");

describe("POST /api/auth/register",() =>{
    beforeEach(()=>{
        db.query.mockReset()
    });
    const vendor = { name: "Peter Otieno", email: "peter@example.com", phone: "0712345678",
                 password: "secret12", role: "vendor",
                 businessName: "AquaPure Springs", estate: "Kasarani" };

it("registers a vendor with matching columns and values", async () => {
  db.query
    .mockResolvedValueOnce([[], []])                 
    .mockResolvedValueOnce([{ insertId: 7 }, []])    
    .mockResolvedValueOnce([{ insertId: 3 }, []]);   

  const response = await request(app).post("/api/auth/register").send(vendor);

  
  expect(response.status).toBe(201);
  expect(response.body.user).toMatchObject({ id: 7, role: "vendor" });

  
  const [sql, params] = db.query.mock.calls[2];          
  const columns = sql.match(/\(([^)]*)\)\s*VALUES/)[1].split(",").length;
  const placeholders = (sql.match(/\?/g) || []).length;
  expect(columns).toBe(placeholders);                    
  expect(params).toEqual([7, "AquaPure Springs", "Kasarani"]);
});
  it("removes the new account if the vendor row cannot be saved", async () => {
    db.query
      .mockResolvedValueOnce([[], []])                  
      .mockResolvedValueOnce([{ insertId: 7 }, []])     
      .mockRejectedValueOnce(new Error("insert failed")) 
      .mockResolvedValueOnce([{ affectedRows: 1 }, []]); 

    const response = await request(app).post("/api/auth/register").send(vendor);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Registration failed");
    expect(db.query.mock.calls[3][0]).toMatch(/DELETE FROM customers/);
    expect(db.query.mock.calls[3][1]).toEqual([7]);
  });

  it("rejects a vendor with no business name or estate", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ ...vendor, estate: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Business name and estate are required for vendors");
    expect(db.query).not.toHaveBeenCalled();
  });

  it("registers a customer without touching the vendors table", async () => {
    db.query
      .mockResolvedValueOnce([[], []])                 
      .mockResolvedValueOnce([{ insertId: 9 }, []]);   

    const response = await request(app).post("/api/auth/register").send({
      name: "Grace Muthoni",
      email: "grace@example.com",
      phone: "0710007919",
      password: "secret12",
      role: "customer"
    });

    expect(response.status).toBe(201);
    expect(db.query).toHaveBeenCalledTimes(2);
  });
});

