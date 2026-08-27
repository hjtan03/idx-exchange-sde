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
});

