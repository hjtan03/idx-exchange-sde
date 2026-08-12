const express = require("express");
const router = express.Router();
const Anthropic = require("@anthropic-ai/sdk");
const pool = require("../db");
const { buildPropertyConditions } = require("../utils/buildPropertyQuery");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a filter-extraction assistant for a real estate search API. Given a natural language property search query, extract the following fields into a JSON object:

{
  "city": string or null,
  "zipcode": string or null,
  "minPrice": number or null,
  "maxPrice": number or null,
  "beds": number or null,
  "baths": number or null,
  "minYearBuilt": number or null,
  "maxYearBuilt": number or null
}

Rules:
- Only extract a value if the query states or clearly implies a specific number or exact name.
- Never guess or estimate a number for vague qualitative language (e.g. "cheap," "spacious," "new," "affordable"). If the query doesn't give you a concrete number, return null for that field.
- Extract city names exactly as they appear in the query, without reformatting casing.
- "beds" and "baths" should be extracted as a minimum count (e.g. "3 bedroom" -> beds: 3), since the search treats these as "at least this many."
- Respond with ONLY the JSON object. No prose, no explanation, no markdown code fences, no leading or trailing text.`;

function stripCodeFences(text) {
    return text
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();
}

function validateExtractedFilters(extracted) {
    const validated = {};

    if (typeof extracted !== "object" || extracted === null) {
        return validated;
    }

    if (typeof extracted.city === "string" && extracted.city.trim() !== "") {
        validated.city = extracted.city.trim();
    }
    if (typeof extracted.zipcode === "string" && extracted.zipcode.trim() !== "") {
        validated.zipcode = extracted.zipcode.trim();
    }
    if (typeof extracted.minPrice === "number" && !Number.isNaN(extracted.minPrice) && extracted.minPrice >= 0) {
        validated.minPrice = extracted.minPrice;
    }
    if (typeof extracted.maxPrice === "number" && !Number.isNaN(extracted.maxPrice) && extracted.maxPrice >= 0) {
        validated.maxPrice = extracted.maxPrice;
    }
    if (typeof extracted.beds === "number" && !Number.isNaN(extracted.beds) && extracted.beds >= 0) {
        validated.beds = extracted.beds;
    }
    if (typeof extracted.baths === "number" && !Number.isNaN(extracted.baths) && extracted.baths >= 0) {
        validated.baths = extracted.baths;
    }
    if (typeof extracted.minYearBuilt === "number" && !Number.isNaN(extracted.minYearBuilt) && extracted.minYearBuilt >= 0) {
        validated.minYearBuilt = extracted.minYearBuilt;
    }
    if (typeof extracted.maxYearBuilt === "number" && !Number.isNaN(extracted.maxYearBuilt) && extracted.maxYearBuilt >= 0) {
        validated.maxYearBuilt = extracted.maxYearBuilt;
    }

    return validated;
}

router.post("/natural", async (req, res) => {
    const { query } = req.body;

    if (!query || typeof query !== "string" || query.trim() === "") {
        return res.status(400).json({ error: "query is required and must be a non-empty string" });
    }

    let message;
    try {
        message = await client.messages.create({
            model: "claude-haiku-4-5",
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: query }]
        });
    } catch (apiError) {
        console.error(apiError);
        return res.status(503).json({ error: "Search is temporarily unavailable. Please try again shortly." });
    }

    const cleaned = stripCodeFences(message.content[0].text);

    let extracted;
    try {
        extracted = JSON.parse(cleaned);
    } catch (parseError) {
        return res.status(200).json({
            results: [],
            interpretedFilters: null,
            message: "We couldn't understand that search. Try rephrasing with specific details like beds, price, or city."
        });
    }

    const validated = validateExtractedFilters(extracted);

    if (Object.keys(validated).length === 0) {
        return res.status(200).json({
            results: [],
            interpretedFilters: null,
            message: "We couldn't extract any specific filters from that search. Try including details like beds, price, or city."
        });
    }

    const { conditions, values } = buildPropertyConditions(validated);

    let sql = "SELECT * FROM rets_property";
    if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(" AND ")}`;
    }
    sql += " LIMIT 20";

    try {
        const [rows] = await pool.query(sql, values);
        res.json({
            results: rows,
            interpretedFilters: validated
        });
    } catch (dbError) {
        console.error(dbError);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;