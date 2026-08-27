jest.mock("../db", () => ({
    query: jest.fn()
}));

const request = require("supertest");
const express = require("express");
const pool = require("../db");
const propertiesRouter = require("../routes/properties");

const app = express();
app.use(express.json());
app.use("/api/properties", propertiesRouter);

beforeEach(() => {
    pool.query.mockReset();
});

describe("GET /api/properties", () => {
    it("returns paginated results with default limit and offset", async () => {
        const mockRows = [
            { id: 1, L_ListingID: "1001", L_City: "Hesperia", L_SystemPrice: 400000 },
            { id: 2, L_ListingID: "1002", L_City: "Hesperia", L_SystemPrice: 450000 }
        ];
        pool.query
            .mockResolvedValueOnce([mockRows])
            .mockResolvedValueOnce([[{ total: 2 }]]);

        const res = await request(app).get("/api/properties");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            total: 2,
            limit: 20,
            offset: 0,
            results: mockRows
        });
    });
    it("respects custom limit and offset query params", async () => {
        const mockRows = [
            { id: 5, L_ListingID: "1005", L_City: "Fontana", L_SystemPrice: 300000 }
        ];

        pool.query
            .mockResolvedValueOnce([mockRows])
            .mockResolvedValueOnce([[{ total: 50 }]]);

        const res = await request(app).get("/api/properties?limit=10&offset=20");

        expect(res.status).toBe(200);
        expect(res.body.limit).toBe(10);
        expect(res.body.offset).toBe(20);
        expect(res.body.results).toEqual(mockRows);
        const [sql, params] = pool.query.mock.calls[0];
        expect(params).toContain(10);
        expect(params).toContain(20);
    });
    it("filters by city", async () => {
        const mockRows = [
            { id: 3, L_ListingID: "1003", L_City: "Hesperia", L_SystemPrice: 350000 }
        ];
        pool.query
            .mockResolvedValueOnce([mockRows])
            .mockResolvedValueOnce([[{ total: 1 }]]);

        const res = await request(app).get("/api/properties?city=Hesperia");

        expect(res.status).toBe(200);
        expect(res.body.results).toEqual(mockRows);
        const [sql, params] = pool.query.mock.calls[0];
        expect(sql).toContain("L_City");
        expect(params).toContain("Hesperia");
    });
    it("filters by zipcode", async () => {
        const mockRows = [
            { id: 4, L_ListingID: "1004", L_City: "Hesperia", L_Zip: "92345", L_SystemPrice: 380000 }
        ];
        pool.query
            .mockResolvedValueOnce([mockRows])
            .mockResolvedValueOnce([[{ total: 1 }]]);

        const res = await request(app).get("/api/properties?zipcode=92345");

        expect(res.status).toBe(200);
        expect(res.body.results).toEqual(mockRows);

        const [sql, params] = pool.query.mock.calls[0];
        expect(sql).toContain("L_Zip");
        expect(params).toContain("92345");
    });
    it("filters by minPrice", async () => {
        const mockRows = [
            { id: 6, L_ListingID: "1006", L_City: "Hesperia", L_SystemPrice: 500000 }
        ];
        pool.query
            .mockResolvedValueOnce([mockRows])
            .mockResolvedValueOnce([[{ total: 1 }]]);

        const res = await request(app).get("/api/properties?minPrice=400000");

        expect(res.status).toBe(200);
        expect(res.body.results).toEqual(mockRows);

        const [sql, params] = pool.query.mock.calls[0];
        expect(sql).toContain("L_SystemPrice >=");
        expect(params).toContain(400000);
    });

    it("filters by maxPrice", async () => {
        const mockRows = [
            { id: 7, L_ListingID: "1007", L_City: "Hesperia", L_SystemPrice: 350000 }
        ];
        pool.query
            .mockResolvedValueOnce([mockRows])
            .mockResolvedValueOnce([[{ total: 1 }]]);

        const res = await request(app).get("/api/properties?maxPrice=400000");

        expect(res.status).toBe(200);
        expect(res.body.results).toEqual(mockRows);

        const [sql, params] = pool.query.mock.calls[0];
        expect(sql).toContain("L_SystemPrice <=");
        expect(params).toContain(400000);
    });

    it("filters by beds", async () => {
        const mockRows = [
            { id: 8, L_ListingID: "1008", L_City: "Hesperia", L_Keyword2: 3 }
        ];
        pool.query
            .mockResolvedValueOnce([mockRows])
            .mockResolvedValueOnce([[{ total: 1 }]]);

        const res = await request(app).get("/api/properties?beds=3");

        expect(res.status).toBe(200);
        expect(res.body.results).toEqual(mockRows);

        const [sql, params] = pool.query.mock.calls[0];
        expect(sql).toContain("L_Keyword2 >=");
        expect(params).toContain(3);
    });

    it("filters by baths", async () => {
        const mockRows = [
            { id: 9, L_ListingID: "1009", L_City: "Hesperia", LM_Dec_3: "2.0" }
        ];
        pool.query
            .mockResolvedValueOnce([mockRows])
            .mockResolvedValueOnce([[{ total: 1 }]]);

        const res = await request(app).get("/api/properties?baths=2");

        expect(res.status).toBe(200);
        expect(res.body.results).toEqual(mockRows);

        const [sql, params] = pool.query.mock.calls[0];
        expect(sql).toContain("LM_Dec_3 >=");
        expect(params).toContain(2);
    });
    it("returns 400 for limit above 100", async () => {
        const res = await request(app).get("/api/properties?limit=200");
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/limit/i);
        expect(pool.query).not.toHaveBeenCalled();
    });

    it("returns 400 for limit below 1", async () => {
        const res = await request(app).get("/api/properties?limit=0");
        expect(res.status).toBe(400);
        expect(pool.query).not.toHaveBeenCalled();
    });

    it("returns 400 for negative offset", async () => {
        const res = await request(app).get("/api/properties?offset=-1");
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/offset/i);
        expect(pool.query).not.toHaveBeenCalled();
    });

    it("returns 400 for non-numeric minPrice", async () => {
        const res = await request(app).get("/api/properties?minPrice=abc");
        expect(res.status).toBe(400);
        expect(pool.query).not.toHaveBeenCalled();
    });

    it("returns 400 for negative minPrice", async () => {
        const res = await request(app).get("/api/properties?minPrice=-100");
        expect(res.status).toBe(400);
        expect(pool.query).not.toHaveBeenCalled();
    });

    it("returns 400 for negative maxPrice", async () => {
        const res = await request(app).get("/api/properties?maxPrice=-1");
        expect(res.status).toBe(400);
        expect(pool.query).not.toHaveBeenCalled();
    });

    it("returns 400 for negative beds", async () => {
        const res = await request(app).get("/api/properties?beds=-2");
        expect(res.status).toBe(400);
        expect(pool.query).not.toHaveBeenCalled();
    });

    it("returns 400 for negative baths", async () => {
        const res = await request(app).get("/api/properties?baths=-1");
        expect(res.status).toBe(400);
        expect(pool.query).not.toHaveBeenCalled();
    });

    it("returns 400 when minPrice is greater than maxPrice", async () => {
        const res = await request(app).get("/api/properties?minPrice=1000000&maxPrice=500000");
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/minPrice cannot be greater/i);
        expect(pool.query).not.toHaveBeenCalled();
    });
    it("returns 500 when the database query fails", async () => {
        pool.query.mockRejectedValueOnce(new Error("Connection lost"));

        const res = await request(app).get("/api/properties");

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Internal server error");
    });

    it("filters by minYearBuilt and maxYearBuilt", async () => {
        const mockRows = [
            { id: 10, L_ListingID: "1010", L_City: "Hesperia", YearBuilt: 2005 }
        ];
        pool.query
            .mockResolvedValueOnce([mockRows])
            .mockResolvedValueOnce([[{ total: 1 }]]);

        const res = await request(app).get("/api/properties?minYearBuilt=2000&maxYearBuilt=2010");

        expect(res.status).toBe(200);
        expect(res.body.results).toEqual(mockRows);

        const [sql, params] = pool.query.mock.calls[0];
        expect(sql).toContain("YearBuilt >=");
        expect(sql).toContain("YearBuilt <=");
        expect(params).toContain(2000);
        expect(params).toContain(2010);
    });
});

describe("GET /api/properties/:id", () => {
    it("returns a single property by L_ListingID", async () => {
        const mockProperty = { id: 1, L_ListingID: "1077426281", L_City: "Hesperia" };
        pool.query.mockResolvedValueOnce([[mockProperty]]);

        const res = await request(app).get("/api/properties/1077426281");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockProperty);

        const [sql, params] = pool.query.mock.calls[0];
        expect(sql).toContain("WHERE L_ListingID = ?");
        expect(params).toEqual(["1077426281"]);
    });

    it("returns 404 for an unknown listing ID", async () => {
        pool.query.mockResolvedValueOnce([[]]);

        const res = await request(app).get("/api/properties/999999999999");

        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/not found/i);
    });

    it("returns 400 for an oversized listing ID", async () => {
        const oversizedId = "9".repeat(300);
        const res = await request(app).get(`/api/properties/${oversizedId}`);

        expect(res.status).toBe(400);
        expect(pool.query).not.toHaveBeenCalled();
    });
    it("returns 500 when the database query fails", async () => {
        pool.query.mockRejectedValueOnce(new Error("Connection lost"));

        const res = await request(app).get("/api/properties/1077426281");

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Internal server error");
    });
});

describe("GET /api/properties/:id/openhouses", () => {
    it("returns open house results ordered by date and time", async () => {
        const mockProperty = { id: 1, L_ListingID: "1077426281" };
        const mockOpenHouses = [
            { id: 1, L_ListingID: "1077426281", OpenHouseDate: "2026-08-15", OH_StartTime: "10:00:00" }
        ];

        pool.query
            .mockResolvedValueOnce([[mockProperty]])   // existence check
            .mockResolvedValueOnce([mockOpenHouses]);   // openhouses query

        const res = await request(app).get("/api/properties/1077426281/openhouses");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockOpenHouses);

        const [secondSql] = pool.query.mock.calls[1];
        expect(secondSql).toContain("ORDER BY OpenHouseDate ASC, OH_StartTime ASC");
    });

    it("returns an empty array when the property has no open houses", async () => {
        const mockProperty = { id: 2, L_ListingID: "1234567890" };

        pool.query
            .mockResolvedValueOnce([[mockProperty]])
            .mockResolvedValueOnce([[]]);

        const res = await request(app).get("/api/properties/1234567890/openhouses");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
    it("returns 404 for a listing ID with no matching property (orphaned openhouse case)", async () => {
        pool.query.mockResolvedValueOnce([[]]);
        const res = await request(app).get("/api/properties/552066853/openhouses");
        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/not found/i);
        expect(pool.query).toHaveBeenCalledTimes(1);
    });
    it("returns 500 when the property existence check fails", async () => {
        pool.query.mockRejectedValueOnce(new Error("Connection lost"));

        const res = await request(app).get("/api/properties/1077426281/openhouses");

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Internal server error");
    });
});

