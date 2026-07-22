const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
    let limit = Number(req.query.limit || 20);
    let offset = Number(req.query.offset || 0);

    const city = req.query.city;
    const zipcode = req.query.zipcode;

    let minPrice = req.query.minPrice;
    let maxPrice = req.query.maxPrice;
    let beds = req.query.beds;
    let baths = req.query.baths;

    if (minPrice !== undefined) minPrice = Number(minPrice);
    if (maxPrice !== undefined) maxPrice = Number(maxPrice);
    if (beds !== undefined) beds = Number(beds);
    if (baths !== undefined) baths = Number(baths);

    if (Number.isNaN(limit) || limit < 1 || limit > 100) {
        return res.status(400).json({ error: "limit must be an integer between 1 and 100" });
    }
    if (Number.isNaN(offset) || offset < 0) {
        return res.status(400).json({ error: "offset must be a non-negative integer" });
    }

    if (minPrice !== undefined && (Number.isNaN(minPrice) || minPrice < 0)) {
        return res.status(400).json({ error: "minPrice must be a non-negative number" });
    }
    if (maxPrice !== undefined && (Number.isNaN(maxPrice) || maxPrice < 0)) {
        return res.status(400).json({ error: "maxPrice must be a non-negative number" });
    }
    if (beds !== undefined && (Number.isNaN(beds) || beds < 0)) {
        return res.status(400).json({ error: "beds must be a non-negative integer" });
    }
    if (baths !== undefined && (Number.isNaN(baths) || baths < 0)) {
        return res.status(400).json({ error: "baths must be a non-negative integer" });
    }

    if (
        minPrice !== undefined &&
        maxPrice !== undefined &&
        minPrice > maxPrice
    ) {
        return res.status(400).json({
            error: "minPrice cannot be greater than maxPrice"
        });
    }

    const conditions = [];
    const values = [];
    if (city) {
        conditions.push("LOWER(TRIM(L_City)) = LOWER(TRIM(?))");
        values.push(city);
    }
    if (zipcode) {
        conditions.push("L_Zip = ?");
        values.push(zipcode);
    }
    if (minPrice !== undefined) {
        conditions.push("L_SystemPrice >= ?");
        values.push(minPrice);
    }
    if (maxPrice !== undefined) {
        conditions.push("L_SystemPrice <= ?");
        values.push(maxPrice);
    }
    if (beds !== undefined) {
        conditions.push("L_Keyword2 >= ?");
        values.push(beds);
    }
    if (baths !== undefined) {
        conditions.push("LM_Dec_3 >= ?");
        values.push(baths);
    }

    let sql = `
        SELECT * 
        FROM rets_property
    `;
    if (conditions.length > 0) {
        sql += `
            WHERE ${conditions.join(" AND ")}
        `;
    }
    sql += `
        LIMIT ?
        OFFSET ?
    `;

    let countSql = `
        SELECT COUNT(*) AS total
        FROM rets_property
    `;
    if (conditions.length > 0) {
        countSql += `
            WHERE ${conditions.join(" AND ")}
        `;
    }

    try {
        const [rows] = await pool.query(sql, [...values, limit, offset]);
        const [countRows] = await pool.query(countSql, values);
        const total = countRows[0].total;
        res.json({
            total,
            limit,
            offset,
            results: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:id/openhouses", async (req, res) => {
    const id = req.params.id;

    if (!id || id.length > 255) {
        return res.status(400).json({ error: "Invalid listing ID" });
    }

    try {
        const [propertyRows] = await pool.query(
            "SELECT * FROM rets_property WHERE L_ListingID = ?",
            [id]
        );

        if (propertyRows.length === 0) {
            return res.status(404).json({ error: "Property not found" });
        }

        const [openHouseRows] = await pool.query(
            "SELECT * FROM rets_openhouse WHERE L_ListingID = ? ORDER BY OpenHouseDate ASC, OH_StartTime ASC",
            [id]
        );

        res.json(openHouseRows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;

    if (!id || id.length > 255) {
        return res.status(400).json({ error: "Invalid listing ID" });
    }

    const sql = "SELECT * FROM rets_property WHERE L_ListingID = ?";

    try {
        const [rows] = await pool.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Property not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;